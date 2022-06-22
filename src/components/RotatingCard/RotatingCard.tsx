import GitHubIcon from '@material-ui/icons/GitHub';
import React, { memo } from 'react';

import ToolTip from '../ToolTip/ToolTip';
import { CardContainer } from './RotatingCardStyles';

export type RotatingCardProps = {
  title: string;
  stacks: [string, string, string, string, string?];
  description: string;
  siteUrl?: string;
  githubUrl?: string;
  primaryColor?: string;
  imgUrl: string;
};

const RotatingCard: React.FC<RotatingCardProps> = (props) => {
  const {
    title,
    stacks,
    description,
    siteUrl,
    githubUrl,
    imgUrl,
    primaryColor
  } = props;

  return (
    <CardContainer imgUrl={imgUrl} primaryColor={primaryColor}>
      <div className="card__side card__side--front">
        <div className="top">
          <div className="title">
            <span>{title}</span>
          </div>
        </div>
        <div className="bottom">
          <ul>
            {stacks.map((stack) => (
              <li key={stack}>{stack}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card__side card__side--back">
        {description && <span className="description">{description}</span>}
        {siteUrl && (
          <a
            href={siteUrl}
            className="siteUrl"
            target="_blank"
            rel="noreferrer"
          >
            View Site
          </a>
        )}
        {githubUrl && (
          <ToolTip text="Github Source">
            <a href={githubUrl} target="_blank" rel="noreferrer">
              <GitHubIcon
                className="githubUrl"
                style={{ fontSize: '3.5rem', color: '#101d2c' }}
              />
            </a>
          </ToolTip>
        )}
      </div>
    </CardContainer>
  );
};

export default memo(RotatingCard);
