import styled from 'styled-components';
import chroma from 'chroma-js';

type Props = {
  imgUrl: string;
  primaryColor?: string;
};

export const CustomEndingCardContainer = styled.div<Props>`
  position: relative;
  perspective: 200rem;
  width: 20rem;
  max-width: 95vw;
  height: 28.125rem;

  /* Support for non-hover */
  @media only screen and (hover: none) {
    display: grid;
    height: 43rem;
    grid-template-rows: 2fr 1.3fr;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.15);
  }

  &:hover .card__side--front {
    transform: rotateY(-180deg);
    /* Support for non-hover */
    @media only screen and (hover: none) {
      transform: rotate(0);
    }
  }

  &:hover .card__side--back {
    transform: rotateY(0deg);
    /* Support for non-hover */
    @media only screen and (hover: none) {
      transform: rotate(0);
    }
  }

  .card__side {
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    /* Support for non-hover */
    @media only screen and (hover: none) {
      position: relative;
    }
    transition: all 0.8s ease;
    backface-visibility: hidden;
    overflow: hidden;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.15);
    /* Support for non-hover */
    @media only screen and (hover: none) {
      box-shadow: none;
    }

    &--front {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      background-color: #fff;

      span {
        text-align: center;
        font-size: 3rem;
        color: #b532ab;
      }

      svg {
        margin: 0 !important;
      }
    }

    &--back {
      transform: rotateY(180deg);
      /* Support for non-hover */
      @media only screen and (hover: none) {
        transform: rotate(0);
        background-image: none;
      }
      animation-fill-mode: backwards;
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: column;
      padding: 5rem 1.7rem;
      font-size: 2rem;
      font-style: italic;
    }
  }
`;
