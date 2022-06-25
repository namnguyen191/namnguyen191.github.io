import styled from 'styled-components';

export const SectionSkillsContainer = styled.section`
  /* padding: 0 2rem; */
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: space-evenly;
  justify-items: center;
  gap: 2rem;

  @media only screen and (max-width: 1500px) {
    grid-template-columns: repeat(2, 1fr);
    justify-content: space-around;
    gap: 5rem 0;
  }

  @media only screen and (max-width: 750px) {
    grid-template-columns: 1fr;
  }
`;
