import { FunctionalComponent } from "preact";
import { Article } from "../contexts/ContentContext";
import { parseContent } from "./EditorModule/Content/contentParser";
import { renderContent } from "./EditorModule/Renderers";
import { useEffect, useRef, useState } from "preact/hooks";
import { useToast } from "../contexts/ToastContext";

interface DetailViewProps {
  item: Article;
  onBack: () => void;
}

    interface ShareButtonsProps {
        url: string;
        title: string;
    }



export const ArticleView: FunctionalComponent<DetailViewProps> = ({
  item,
  onBack,
}) => {
  const contentElements = parseContent(item.DetailedDescription);
  const { addToast } = useToast();

  const ShareButtons: FunctionalComponent<ShareButtonsProps> = ({ url, title }) => {
    const [showMore, setShowMore] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
  
    // Toggle for showing more options
    // Click away listener
    useEffect(() => {

      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setShowMore(false);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setShowMore(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, []);
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url).then(() => {
              addToast('Link copied to clipboard!', 'success');
        });
    };

    const nativeShare = () => {
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            }).catch(console.error);
        } else {
            alert('Native sharing is not supported on this device.');
        }
    };

    return (
        <div className="mt-4">
            <div className="flex space-x-4">
                <a
                    href={`https://discord.com/channels/@me?url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800"
                >
                    <i className="fab fa-discord"></i>
                </a>
                <a
                    href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
                    className="text-gray-600 hover:text-gray-800"
                >
                    <i className="fas fa-envelope"></i>
                </a>
                <button onClick={copyToClipboard} className="text-gray-600 hover:text-gray-800">
                    <i className="fas fa-link"></i>
                </button>
                <button onClick={nativeShare} className="text-gray-600 hover:text-gray-800">
                    <i className="fas fa-share-alt"></i>
                </button>
                <button onClick={() => window.print()} className="text-gray-600 hover:text-gray-800">
                    <i className="fas fa-print"></i>
                </button>
                <button onClick={() => setShowMore(!showMore)} className="text-gray-600 hover:text-gray-800">
                    <i className="fas fa-ellipsis-h"></i>
                </button>
            </div>
            {showMore && (
        <div
        ref={dropdownRef}
        className="absolute z-10 left-0 mt-2 w-full flex space-x-4 bg-white shadow-lg rounded-lg p-4 transition-opacity duration-300 ease-in-out"
        style={{ opacity: showMore ? 1 : 0 }}
      >
                <div className="flex space-x-4 mt-4 transition-all duration-300 ease-in-out transform scale-95 origin-top">
                    <a
                        href={`https://steamcommunity.com/sharedfiles/edititem/767/3/?url=${encodedUrl}&title=${encodedTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-gray-900"
                    >
                        <i className="fab fa-steam"></i>
                    </a>
                    <a
                        href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-700"
                    >
                        <i className="fab fa-reddit-alien"></i>
                    </a>
                    <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                </div>
                </div>
            )}
        </div>
    );
};

  return (
    <>
      <svg
        className="absolute blur-3xl opacity-15 right-96 -mt-96 z-0"
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

      
      <div className="px-8 py-32 mx-auto ml article-container md:px-6 lg:px-18 lg:py-22 relative z-20">

      <div className="flex justify-between items-center mb-8">
                        <button
                            className="group w-10 h-10 rounded-full border border-stone-300 text-stone-600 text-lg flex items-center justify-center transition duration-300 !bg-stone-200 cursor-pointer hover:!bg-gray-300"
                            onClick={onBack}
                        >
                            <i className="fas fa-arrow-up transform -rotate-45 transition-transform duration-300 group-hover:-rotate-90"></i>
                        </button>
                        <ShareButtons url={window.location.href} title={item.Title} />
                    </div>
                    <h1 className="mt-8 text-4xl font-normal tracking-tighter text-black/75 sm:text-5xl">
          {item.Title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          <hr className="my-4"></hr>
          </h1>
        <div className="detail-view px-4 py-4">
          <div className="mt-4">
            {renderContent(contentElements, true)}
          </div>
        </div>
      </div>
    </>
  );
};
