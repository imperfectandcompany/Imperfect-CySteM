import { FunctionalComponent } from "preact";
import { Article } from "../contexts/ContentContext";
import { parseContent } from "./EditorModule/Content/contentParser";

interface DetailViewProps {
  item: Article;
  onBack: () => void;
}

export const ArticleView: FunctionalComponent<DetailViewProps> = ({
  item,
  onBack,
}) => {
  const contentElements = parseContent(item.DetailedDescription);

  return (
    <>
      <svg
        className="absolute blur-3xl opacity-30 right-96 -mt-96 z-0"
        width="70%"
        height="70%"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_17_60)">
          <g filter="url(#filter0_f_17_60)">
            <path
              d="M128.6 0H0V322.2L332.5 211.5L128.6 0Z"
              fill="#4D07E3"
            ></path>
            <path
              d="M0 322.2V400H240H320L332.5 211.5L0 322.2Z"
              fill="#4C00FF"
            ></path>
            <path
              d="M320 400H400V78.75L332.5 211.5L320 400Z"
              fill="#B5BFF1"
            ></path>
            <path
              d="M400 0H128.6L332.5 211.5L400 78.75V0Z"
              fill="#7fcef3"
            ></path>
          </g>
        </g>
        <defs>
          <filter
            id="filter0_f_17_60"
            x="-159.933"
            y="-159.933"
            width="719.867"
            height="719.867"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            ></feBlend>
            <feGaussianBlur
              stdDeviation="79.9667"
              result="effect1_foregroundBlur_17_60"
            ></feGaussianBlur>
          </filter>
        </defs>
      </svg>
      <div className="px-8 py-32 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22 relative z-20">
        <div className="detail-view px-4 py-4">
          <button
            className="mt-2 px-6 py-2 bg-black/15 rounded hover:cursor-pointer focus:cursor-auto focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ease-in-out !z-20"
            onClick={onBack}
          >
            Back
          </button>
          <h1 className="mt-8 text-4xl font-normal tracking-tighter text-black/75 sm:text-5xl">
          {item.Title}
          </h1>
          <div className="detail-description mt-4">
            {/* {renderContent(contentElements)} */}
          </div>
        </div>
      </div>
    </>
  );
};
