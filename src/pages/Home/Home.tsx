import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CodeIcon from '@material-ui/icons/Code';
import GitHubIcon from '@material-ui/icons/GitHub';
import HomeIcon from '@material-ui/icons/Home';
import LayersIcon from '@material-ui/icons/Layers';
import Head from 'next/head';

import Footer from '../Components/Footer/Footer';
import Navbar from '../Components/Navbar/Navbar';
import SectionInfo from '../Sections/HomePageSections/SectionInfo/SectionInfo';
import SectionIntro from '../Sections/HomePageSections/SectionIntro/SectionIntro';
import SectionProject from '../Sections/HomePageSections/SectionProjects/SectionProject';
import SectionSkills from '../Sections/HomePageSections/SectionSkills/SectionSkills';
import { HomeContainer } from '../styles/HomeStyles';

const Home = () => {
  return (
    <HomeContainer>
      <Head>
        <title>Nam Nguyen - Developer Portfolio</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Nam Vu Hoang Nguyen is a Full-Stack Web Developer (React, Angular, Node, .Net) in Toronto, Canada. Currently pursuing a B.Sc. in Computer Science at York University."
        />
        <meta
          name="keywords"
          content="Nam Nguyen, Portfolio, Profile, York University, Student, Full-Stack, Developer, Website, Webapp"
        />
        <meta name="author" content="Nam Nguyen" />
      </Head>

      <Navbar bgColor="#23232e">
        <ul className="nav">
          <li className="nav-item">
            <a href="#home" title="Home" className="nav-link">
              <HomeIcon />
              <span className="link-text">Home</span>
            </a>
          </li>

          <li className="nav-item">
            <a href="#about" title="About" className="nav-link">
              <AccountCircleIcon />
              <span className="link-text">About</span>
            </a>
          </li>

          <li className="nav-item">
            <a href="#stacks" title="Stacks" className="nav-link">
              <LayersIcon />
              <span className="link-text">Stacks</span>
            </a>
          </li>

          <li className="nav-item">
            <a href="#projects" title="Projects" className="nav-link">
              <CodeIcon />
              <span className="link-text">Projects</span>
            </a>
          </li>

          <li className="nav-item bottom">
            <a
              href="https://github.com/namnguyen191"
              title="GitHub"
              target="_blank"
              className="nav-link"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
              <span className="link-text">Github</span>
            </a>
          </li>
        </ul>
      </Navbar>

      <main>
        <SectionIntro />
        <SectionInfo />
        <SectionSkills />
        <SectionProject />
      </main>

      <Footer>
        &copy; 2021 by Nam Nguyen. All rights reserved. &nbsp;
        <a
          href="https://github.com/namnguyen191/nextjs-portfolio"
          style={{ color: 'blue' }}
        >
          Free to use for learning purposes.
        </a>
      </Footer>
    </HomeContainer>
  );
};

export default Home;
