import React, { memo } from 'react';

import AnimatedLink from '../../../Components/AnimatedLink/AnimatedLink';
import { SectionInfoContainer } from './SectionInfoStyles';

export type SectionInfoProps = {};

const SectionInfo: React.FC<SectionInfoProps> = (props) => {
  const {} = props;

  return (
    <SectionInfoContainer id="about">
      <div className="container">
        <h3>About Me</h3>
        <p>
          Hi there! I&apos;m Nam Nguyen from Toronto, Canada. I&apos;m
          currently pursuing my B.Sc. in Computer Science at York
          University as a full-time student. Being developer, I enjoy doing
          research on my own, solving new challenges and learning new
          technologies. I especially open to criticism and always ready to
          learn from others.
        </p>
        <span className="quote">
          “ Your mind is programmable – if you&apos;re not programming your
          mind, someone else will program it for you ” ‐ Jeremy Hammond
        </span>
      </div>
      <div className="container">
        <h3>Contact Me At:</h3>
        <span className="contact-link-container">
          <img
            src="/linkedin.svg"
            alt="Linked Icon"
            width={35}
            height={35}
          />
          <AnimatedLink
            linkName="@LinkedIn: Nam Nguyen"
            url="https://www.linkedin.com/in/nam-nguyen-865226132"
          />
        </span>
        <span className="contact-link-container">
          <img src="/gmail.svg" alt="Gmail Icon" width={35} height={35} />
          <AnimatedLink
            linkName="@GMail: hoangnamnguyen191"
            url="mailto:hoangnamnguyen191@gmail.com"
          />
        </span>
        <span className="contact-link-container">
          <img
            src="/github.svg"
            alt="Github Icon"
            width={35}
            height={35}
          />
          <AnimatedLink
            linkName="@GitHub: namnguyen191"
            url="https://github.com/namnguyen191"
          />
        </span>
      </div>
    </SectionInfoContainer>
  );
};

export default memo(SectionInfo);
