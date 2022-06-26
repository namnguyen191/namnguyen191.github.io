import React, { memo } from 'react';

import CustomEndingCard from '../../../components/CustomEndingCard/ToBeContinuedCard';
import RotatingCard from '../../../Components/RotatingCard/RotatingCard';
import { SectionProjectContainer } from './SectionProjectStyles';

export type SectionProjectProps = {};

const SectionProject: React.FC<SectionProjectProps> = (props) => {
  const {} = props;

  return (
    <SectionProjectContainer id="projects">
      <h3>PROJECTS PORTFOLIO</h3>
      <div className="cards-container">
        <RotatingCard
          description="A SIMPLE TRAVEL WEBSITE BUILT USING ADVANCE CSS TECHNIQUES"
          imgUrl="/natour.webp"
          stacks={['html', 'css', 'sass', 'bootstrap']}
          title="Natour Travel Website"
          githubUrl="https://github.com/namnguyen191/Natours"
          siteUrl="https://namnguyen191.github.io/Natours/"
          primaryColor="#28b485"
        />
        <RotatingCard
          description="A SIMPLE REAL ESTATE WEBSITE BUILT USING THE POWER OF CSS GRID"
          imgUrl="/nexter-min.webp"
          stacks={['html', 'css', 'sass', 'grid']}
          title="Nexter Real Estate"
          githubUrl="https://github.com/namnguyen191/nexter"
          siteUrl="https://namnguyen191.github.io/nexter/"
          primaryColor="#775835"
        />
        <RotatingCard
          description="A SIMPLE TRAVEL SERVICE WEBSITE BUILT USING FLEXBOX"
          imgUrl="/trillio-min.webp"
          stacks={['html', 'css', 'sass', 'flexbox']}
          title="Trillio Travel Service"
          githubUrl="https://github.com/namnguyen191/Trillo"
          siteUrl="https://namnguyen191.github.io/Trillo/"
          primaryColor="#ba265d"
        />
        <RotatingCard
          description="A SINGLE PAGE APPLICATION THAT PROVIDES SURVEYS SENDING SERVICE"
          imgUrl="/survey.webp"
          stacks={[
            'react with redux',
            'node with express',
            'mongodb',
            'google oauth',
            'sendgrid | stripe'
          ]}
          title="Sirvey: A survey service"
          githubUrl="https://github.com/namnguyen191/react-survey-app"
          siteUrl="https://reactsirvey.herokuapp.com/"
          primaryColor="#14a0c4"
        />
        <RotatingCard
          description="AN ONLINE DATING SPA THAT SUPPORT ONLINE CHAT AND IMAGE UPLOAD"
          imgUrl="/dating-app-crop.webp"
          stacks={[
            'angular',
            '.net core api',
            'mysql',
            'jwt auth token',
            'cloudinary'
          ]}
          title="DatingApp: An E-Date Service"
          githubUrl="https://github.com/namnguyen191/DatingAppV2-dotnet5"
          siteUrl="https://dotnet5-datingapp.herokuapp.com/"
          primaryColor="#c34113"
        />
        <RotatingCard
          description="A TRAVEL WEBSITE WITH COMPLETE BACK-END API"
          imgUrl="/natour.webp"
          stacks={['nodejs', 'express', 'mongodb', 'jwt', 'stripe']}
          title="Natour Travel Website API"
          githubUrl="https://github.com/namnguyen191/Natours-API"
          siteUrl="https://udemynatours.herokuapp.com/"
          primaryColor="#28b485"
        />
        <RotatingCard
          description="A COLOR PICKER SPA BUILT WITH REACTJS AND MATERIAL-UI!"
          imgUrl="/gradient_8.png"
          stacks={['reactjs', 'material-ui', 'typescript', 'chromajs']}
          title="React Color Picker"
          githubUrl="https://github.com/namnguyen191/react-ts-colors-app"
          siteUrl="https://rainbow-wave.herokuapp.com/"
          primaryColor="#cdda21"
        />
        <RotatingCard
          description="A RECIPE MANAGER WEBSITE BUILT WITH ANGULAR"
          imgUrl="/recipe-app.webp"
          stacks={['Angular', 'Bootstrap', 'typescript', 'firebase']}
          title="Angular Recipe Manager"
          githubUrl="https://github.com/namnguyen191/angular-recipe-app"
          siteUrl="https://angular-recipe-project-fa966.web.app/"
        />
        <RotatingCard
          description="A SIMPLE RECIPE FINDER APP BUILT USING THE LATEST ES6 FEATURES"
          imgUrl="/forkify.png"
          stacks={['html', 'css', 'ES6', 'webpack']}
          title="Forkify Recipe Finder"
          githubUrl="https://github.com/namnguyen191/forkify"
          siteUrl="https://namnguyen191.github.io/forkify/"
          primaryColor="#FBDB89"
        />
        <RotatingCard
          description="A SIMPLE WEBSITE TO PROMOTE THE YUHACK HACKATHON EVENT"
          imgUrl="/yuHacks-Logo.png"
          stacks={['html', 'css', 'js', 'gulp']}
          title="YuHacks Hackathon"
          siteUrl="https://yuhacks.info/"
          primaryColor="#2d698a"
        />
        <RotatingCard
          description="A COOL PROJECT TO SHARPEN MY ANGULAR, CSS AND JS SKILLS"
          imgUrl="/angular-50-bg.webp"
          stacks={['angular', 'scss', 'js', 'html']}
          title="Angular 50 Projects"
          siteUrl="https://namnguyen191.github.io/fifty-projects/"
          githubUrl="https://github.com/namnguyen191/fifty-projects"
          primaryColor="#4087e4"
        />
        <RotatingCard
          description="AN ONLINE CODE EDITOR AND COMPILER. BUILT WITH CODES MAINTAINABILITY IN MIND BY USING TYPESCRIPT"
          imgUrl="/online-compiler-bg.webp"
          stacks={['react', 'typescript', 'redux', 'axios']}
          title="Online Compiler"
          githubUrl="https://github.com/namnguyen191/OnlineCompiler"
          primaryColor="#200a5a"
        />
        <CustomEndingCard />
      </div>
    </SectionProjectContainer>
  );
};

export default memo(SectionProject);
