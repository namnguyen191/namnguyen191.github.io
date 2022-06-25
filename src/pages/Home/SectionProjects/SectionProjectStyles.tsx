import styled from 'styled-components';

export const SectionProjectContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5rem;

  h3 {
    font-size: 5rem;
    color: #27052e;
    text-align: center;
  }

  .cards-container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, min-content));
    justify-content: center;
    justify-items: center;
    gap: 3rem;
  }
`;
