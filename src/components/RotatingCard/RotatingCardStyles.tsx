import styled from 'styled-components';
import chroma from 'chroma-js';

type Props = {
  imgUrl: string;
  primaryColor?: string;
};

export const CardContainer = styled.div<Props>`
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
    background-image: linear-gradient(
      152deg,
      #fff,
      ${({ primaryColor = '#fff' }) => chroma(primaryColor).brighten(0.8).hex()}
    );
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
      .top {
        height: 40%;
        position: relative;
        background-image: linear-gradient(
            to right bottom,
            #000,
            ${({ primaryColor = '#fff' }) =>
              chroma(primaryColor).darken(1.2).hex()}
          ),
          url(${(props) => props.imgUrl});
        background-size: cover;
        background-blend-mode: screen;
        clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
        border-top-left-radius: 0.3rem;
        border-top-right-radius: 0.3rem;

        .title {
          font-size: 1.5rem;
          font-weight: 400;
          text-transform: uppercase;
          text-align: right;
          color: ${({ primaryColor }) => {
            if (!primaryColor) {
              return '#161515';
            }
            return '#f9f7f6';
          }};
          position: absolute;
          top: 4rem;
          right: 1.25rem;
          width: 75%;
          line-height: 2.4rem;

          span {
            padding: 0.625rem 1.6rem;
            box-decoration-break: clone;
            background-image: linear-gradient(
              to right bottom,
              ${({ primaryColor = '#fff' }) =>
                chroma(primaryColor).brighten(0.5).alpha(0.75).hex()},
              ${({ primaryColor = '#fff' }) =>
                chroma(primaryColor).darken(1.8).alpha(0.75).hex()}
            );
          }
        }
      }

      .bottom {
        height: 60%;
        padding: 1.875rem;

        ul {
          list-style: none;
          padding: 0;
          width: 80%;
          margin: 0 auto;

          li {
            text-transform: uppercase;
            text-align: center;
            font-size: 1rem;
            font-weight: 700;
            color: #54483a;
            padding: 0.85rem;

            &:not(:last-child) {
              border-bottom: 0.1rem solid #aaa;
            }
          }
        }
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
      background-image: linear-gradient(
        to right bottom,
        #000,
        ${({ primaryColor = '#fff' }) => chroma(primaryColor).darken(0.5).hex()}
      );

      a {
        display: block;
      }

      .description {
        color: #f9f7f6;
        text-align: center;
        font-size: 1.1rem;
        font-weight: 700;
        text-transform: uppercase;
        line-height: 2rem;
        /* Support for non-hover */
        @media only screen and (hover: none) {
          color: #504d4d;
        }
      }

      .siteUrl {
        font-size: 2.5rem;
        font-weight: 700;
        text-decoration: none;
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        transition: all 0.2s;

        background-image: linear-gradient(
          52deg,
          ${({ primaryColor = '#fff' }) =>
            chroma(primaryColor).darken(1).hex()},
          ${({ primaryColor = '#fff' }) =>
            chroma(primaryColor).brighten(1.8).hex()}
        );

        @media only screen and (hover: none) {
          background-image: linear-gradient(
            to right,
            ${({ primaryColor = '#fff' }) =>
              chroma(primaryColor).darken(1).hex()},
            ${({ primaryColor = '#fff' }) =>
              chroma(primaryColor).darken(1.5).hex()}
          );
        }

        &:hover {
          transform: skewY(1deg) skewX(10deg) scale(1.1);
          text-shadow: 0.5rem 1rem 2rem rgba(0, 0, 0, 0.2);
        }
      }

      .githubUrl {
        transition: all 200ms ease;

        &:hover {
          color: ${() => chroma('#101d2c').brighten(0.9).hex()}!important;
          transform: translateY(-0.8rem);
        }
      }
    }
  }
`;
