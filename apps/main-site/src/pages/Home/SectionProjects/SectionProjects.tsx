// oxlint-disable import/no-relative-parent-imports no-console
import pLimit from 'p-limit';
import { useEffect, useState, type ReactElement } from 'react';

import { ToBeContinuedCard } from '../../../components/CustomEndingCard/ToBeContinuedCard';
import { LoadingSpinner } from '../../../components/LoadingSpinner/LoadingSpinner';
import { ProjectCard, type ProjectCardProps } from '../../../components/ProjectCard/ProjectCard';
import { getFile, getUserRepos, type Repo } from '../../../utils/api/github.api';

import styles from './SectionProjects.module.scss';

interface RepoMetaData {
  imgUrl: string;
  stacks: [string, string, string, string, string?];
  primaryColor: string;
  title: string;
}

const getProjectCardProps = async (repo: Repo): Promise<ProjectCardProps | null> => {
  const readme = await getFile('namnguyen191', repo.name, repo.default_branch, 'README.md');
  if (!readme) return null;

  const metaDataRegex = /(?<=\*\*\*MetaData\*\*\*\s*)(.*?)(?=\s*\*\*\*MetaData\*\*\*)/gs;
  const jsonRegex = /{(.*?)}/gs;

  // oxlint-disable-next-line no-magic-numbers
  const rawJson = readme.match(metaDataRegex)?.[0]?.match(jsonRegex)?.[0];
  if (!rawJson) {
    console.warn('invalid or non-existing meta data for project:', repo.full_name);
    return null;
  }

  let metaData: RepoMetaData;
  try {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    metaData = JSON.parse(rawJson) as RepoMetaData;
  } catch (error) {
    console.warn('failed to parse meta data for project:', repo.full_name, error);
    return null;
  }

  return {
    ...metaData,
    description: repo.description || 'No description',
    siteUrl: repo.homepage || 'https://github.com',
    githubUrl: repo.html_url,
  };
};

const getProjects = async (): Promise<ProjectCardProps[]> => {
  // oxlint-disable-next-line no-magic-numbers
  const ghRequestsLimit = pLimit(10);

  const PAGE_LENGTH = 100; // GitHub's maximum per_page
  const MAX_PAGES = 50; // Safety cap against runaway pagination

  const accumulatedRepo: Repo[] = [];

  for (let pageNumber = 1; pageNumber <= MAX_PAGES; pageNumber++) {
    // Sequential on purpose: whether another page exists depends on this page's length.
    // oxlint-disable-next-line no-await-in-loop
    const response = await getUserRepos({
      user: 'namnguyen191',
      pageLength: PAGE_LENGTH,
      pageNumber,
    });

    const repos = response ?? [];
    accumulatedRepo.push(...repos);

    if (repos.length < PAGE_LENGTH) break;
  }

  const featuredRepos = accumulatedRepo.filter((repo) => repo.topics?.includes('featured'));

  const results = await Promise.allSettled(
    featuredRepos.map((repo) => ghRequestsLimit(() => getProjectCardProps(repo)))
  );

  const projectCardsProps: ProjectCardProps[] = [];
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      // Array order remain the same after mapping and results array are from featuredRepos
      // oxlint-disable-next-line typescript/no-non-null-assertion
      console.warn('failed to load project:', featuredRepos[index]!.full_name, result.reason);
    } else if (result.value) {
      projectCardsProps.push(result.value);
    }
  });

  return projectCardsProps;
};

export const SectionProjects = (): ReactElement => {
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const renderProjectsCard = (): ReactElement | ReactElement[] => {
    if (loading) return <LoadingSpinner scale="3" />;

    if (!projects.length) return <div>{'There’s no project to display'}</div>;

    return projects.map((project) => (
      <div key={project.githubUrl} className={styles['card-animation-container']}>
        <ProjectCard {...project} />
      </div>
    ));
  };

  useEffect(() => {
    if (loading) {
      getProjects()
        .then((projectsMetaData) => {
          setLoading(false);
          setProjects(projectsMetaData);
        })
        .catch((error: unknown) => {
          // oxlint-disable-next-line no-console
          console.error(`Something went wrong: ${JSON.stringify(error)}`);
        });
    }
  }, [loading]);

  return (
    <section className={styles['section-projects-container']} id="projects">
      <h3>{'PROJECTS PORTFOLIO'}</h3>
      <div className={styles['cards-container']}>
        {renderProjectsCard()}
        <ToBeContinuedCard />
      </div>
    </section>
  );
};
