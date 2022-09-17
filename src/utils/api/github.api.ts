import axios, { AxiosResponse } from 'axios';

const GITHUB_RAW_FILE_BASE_URL = 'https://raw.githubusercontent.com';
const GITHUB_API_BASE_URL = 'https://api.github.com';

type Repo = {
  id: number;
  name: string;
  full_name: string;
  description: null | string;
  language: string;
  default_branch: string;
  html_url: string;
  topics: string[];
  homepage: string | null;
};

export const getFile = async (
  user: string,
  project: string,
  branch: string,
  file: string
): Promise<string | null> => {
  let res: AxiosResponse<any, any>;
  try {
    res = await axios.get<any>(
      `${GITHUB_RAW_FILE_BASE_URL}/${user}/${project}/${branch}/${file}`
    );

    return res.data as string;
  } catch (error) {
    return null;
  }
};

export const getUserRepos = async (params: {
  user: string;
  sortBy?: 'created' | 'updated' | 'pushed' | 'full_name';
  sortDirection?: 'asc' | 'desc';
  pageLength?: number;
  pageNumber?: number;
}): Promise<Repo[] | null> => {
  const {
    user,
    sortBy = 'created',
    sortDirection = 'desc',
    pageLength = 30,
    pageNumber = 1
  } = params;

  if (pageLength > 100) {
    console.error('pageLength cannot exceed 100');
    return null;
  }

  let res: AxiosResponse<Repo[], any>;
  try {
    res = await axios.get<Repo[]>(
      `${GITHUB_API_BASE_URL}/users/${user}/repos?type=owner&sort=${sortBy}&direction=${sortDirection}&per_page=${pageLength}&page=${pageNumber}`
    );

    return res.data;
  } catch (error) {
    return null;
  }
};
