import { useState, useEffect, useRef } from "preact/hooks";
import { Fragment, JSX } from "preact/jsx-runtime";
import { ContentElement } from "../../contentTypes";
import { parseContent } from "../../contentParser";
import { renderContent } from "../../contentRenderer";

interface EditableComponentProps {
  tag: keyof JSX.IntrinsicElements;
  children: string;
  [key: string]: any;
}

const EditableComponent = ({
  tag: Tag,
  children,
  ...props
}: EditableComponentProps) => {
  const [isEditing, setEditing] = useState(false);
  const [text, setText] = useState(children);

  function handleDoubleClick() {
    setEditing(true);
  }

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    setText(target.value);
  }

  function handleBlur() {
    setEditing(false);
  }

  if (isEditing) {
    return (
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        className="p-2 text-base w-full"
        autoFocus
      />
    );
  }

  return (
    <Tag onDblClick={handleDoubleClick} {...props}>
      {text}
    </Tag>
  );
};


interface MenuBarProps {
    isDimensionsEnabled: boolean;
    setDimensionsEnabled: (value: boolean) => void;
    isRulerEnabled: boolean;
    setRulerEnabled: (value: boolean) => void;
    isLayoutZoomEnabled: boolean;
    setLayoutZoomEnabled: (value: boolean) => void;
    isActualMobileDevice: boolean; // Add a prop to indicate if the user is on an actual mobile device
  }
  
  const MenuBar = ({
    isDimensionsEnabled,
    setDimensionsEnabled,
    isRulerEnabled,
    setRulerEnabled,
    isLayoutZoomEnabled,
    setLayoutZoomEnabled,
    isActualMobileDevice, // Add the prop
  }: MenuBarProps) => {
    return (
      <div className="menu-bar select-none">
        <div className="menu-item">
          <button className="menu-button">File</button>
          <div className="dropdown">
            <button className="disabled">New</button>
            <button className="disabled">Open</button>
            <button className="disabled">Save</button>
          </div>
        </div>
        <div className="menu-item">
          <button className="menu-button">View</button>
          <div className="dropdown">
            <button
              title={
                isDimensionsEnabled
                  ? ""
                  : "Enable Dimensions Toolbar to use this option"
              }
              className={`flex justify-between items-center ${
                isDimensionsEnabled && !isActualMobileDevice ? "" : "cursor-not-allowed opacity-50"
              }`}
              onClick={() => {
                if (isDimensionsEnabled && !isActualMobileDevice) {
                  setLayoutZoomEnabled(!isLayoutZoomEnabled);
                }
              }}
              disabled={isActualMobileDevice} // Disable the button if on actual mobile device
            >
              Layout Zoom
              {isLayoutZoomEnabled && <i className="fas fa-check"></i>}
            </button>
          </div>
        </div>
        <div className="menu-item">
          <button className="menu-button">Window</button>
          <div className="dropdown">
            <label className={`flex justify-between items-center px-4 py-2 ${isActualMobileDevice ? "cursor-not-allowed opacity-50" : ""} `}>
              Dimensions
              <span className="ml-2">
                {isDimensionsEnabled && <i className="fas fa-check"></i>}
              </span>
              <input
                type="checkbox"
                checked={isDimensionsEnabled}
                onChange={() => {
                  if (!isActualMobileDevice) {
                    setDimensionsEnabled(!isDimensionsEnabled);
                  }
                }}
                className={`hidden`}
                disabled={isActualMobileDevice}
              />
            </label>
            <label className="flex justify-between items-center px-4 py-2">
              Ruler
              <span className="ml-2">
                {isRulerEnabled && <i className="fas fa-check"></i>}
              </span>
              <input
                type="checkbox"
                checked={isRulerEnabled}
                onChange={() => setRulerEnabled(!isRulerEnabled)}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    );
  };

interface ToolbarProps {
  showModal: () => void;
}

const Toolbar = ({ showModal }: ToolbarProps) => {
  return (
    <div className="toolbar select-none">
      <button title="Show Syntax" onClick={showModal}>
        <i className="fas fa-code"></i>
        <div className="tooltip">Show Syntax</div>
      </button>
    </div>
  );
};

interface ViewToolbarProps {
  onViewChange: (view: string) => void;
  viewport: { width: number; height: number };
  setViewport: (viewport: { width: number; height: number }) => void;
  isDimensionsEnabled: boolean;
  isLayoutZoomEnabled: boolean;
}

const ViewToolbar = ({
  onViewChange,
  viewport,
  setViewport,
  isDimensionsEnabled,
  isLayoutZoomEnabled,
}: ViewToolbarProps) => {
  return (
    <div className="toolbar hidden w-full relative md:flex items-center justify-between">
      <div className="flex items-center z-10">
        <input
          type="number"
          value={viewport.width}
          title={'Dimensions not yet adjustable through here.'}
          aria-label="Width"
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            setViewport({ ...viewport, width: parseInt(target.value) });
          }}
          className="mr-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          value={viewport.height}
          title={'Dimensions not yet adjustable through here.'}
          aria-label="Height"
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            setViewport({ ...viewport, height: parseInt(target.value) });
          }}
          className="mr-2 p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="absolute inset-0 flex items-center select-none justify-center z-10">
        <button
          onClick={() => onViewChange("mobile")}
          className="device-button mx-1"
        >
          <i className="fas fa-mobile-alt"></i>
          <div className="tooltip">Mobile</div>
        </button>
        <button
          onClick={() => onViewChange("tablet")}
          className="device-button mx-1"
        >
          <i className="fas fa-tablet-alt"></i>
          <div className="tooltip">Tablet</div>
        </button>
        <button
          onClick={() => onViewChange("desktop")}
          className="device-button mx-1"
        >
          <i className="fas fa-desktop"></i>
          <div className="tooltip">Desktop</div>
        </button>
      </div>
      {isDimensionsEnabled && isLayoutZoomEnabled && (
        <div className="flex items-center z-10">
          <select className="p-2 border border-gray-300 rounded" title={'Zoom is not adjustable yet.'} disabled>
            <option className="select-none">100%</option>
            <option>75%</option>
            <option>50%</option>
          </select>
        </div>
      )}
    </div>
  );
};

interface DimensionRulerProps {
  viewport: { width: number; height: number };
}

const DimensionRuler = ({ viewport }: DimensionRulerProps) => {
  const dimensions = [320, 375, 425, 768, 1024, 1440];
  const rulerWidth = 1440; // Maximum width for the ruler

  return (
    <div className="dimension-ruler">
      <span>{viewport.width}px</span>
      {dimensions.map((dim, index) => (
        <Fragment key={index}>
          <div
            className="bar"
            style={{ left: `calc(50% - ${(dim / rulerWidth) * 50}%)` }}
            data-width={`${dim}px`}
          ></div>
          <div
            className="bar"
            style={{ right: `calc(50% - ${(dim / rulerWidth) * 50}%)` }}
            data-width={`${dim}px`}
          ></div>
        </Fragment>
      ))}
    </div>
  );
};

const EditorModule = () => {
  const [elements, setElements] = useState<ContentElement[]>([]);
  const [viewport, setViewport] = useState({ width: 375, height: 812 });
  const [view, setView] = useState("mobile");
  const [isDimensionsEnabled, setDimensionsEnabled] = useState(true);
  const [isRulerEnabled, setRulerEnabled] = useState(true);
  const [isLayoutZoomEnabled, setLayoutZoomEnabled] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const insertElement = (type: string) => {
    const placeholder: Record<string, string> = {
      header: "header | Your header text | text-xl font-bold",
      paragraph: "paragraph | Your paragraph text | text-base",
      image: "image | https://placehold.co/600x400 | Alt text",
      list: "list | Item 1; Item 2; Item 3 | list-disc pl-5",
      accordion: "accordion | Click to expand | bg-blue-200",
      tab: "tab | Tab content here | bg-green-200",
      gallery: "gallery | Image URLs separated by semicolon | bg-purple-200",
      carousel: "carousel | Image URLs separated by semicolon | bg-yellow-200",
      code: 'code | console.log("Hello, world!") | language-js',
      testimonial: 'testimonial | John Doe: "Great product!" | bg-gray-100',
      countdown: "countdown | 2021-12-31T00:00:00 | bg-red-200",
      alert: "alert | Warning: Something went wrong! | bg-red-500",
      table:
        "table | Header1,Header2;Row1Col1,Row1Col2;Row2Col1,Row2Col2 | bg-gray-200",
      card: "card | Title: Card Title;Content: Some quick example text. | bg-blue-100",
      modal: "modal | This is a modal! | bg-white",
      progress: "progress | 70 | bg-green-500",
      leaderboard: "leaderboard | John:100;Doe:90;Jane:80 | bg-indigo-200",
      youtube: "youtube | https://www.youtube.com/embed/dQw4w9WgXcQ",
      feature: "feature | New Feature: Amazing Speed | bg-green-200",
      changelog: "changelog | Version 1.0.1: Fixed bugs | bg-yellow-200",
      stats: "stats | Users: 1000;Transactions: 5000 | bg-blue-200",
      faq: "faq | What is this product?;It is a content editor. | bg-purple-200",
      datavisualization:
        "data-visualization | Data Points: 100,200,300 | bg-teal-200",
      infocard:
        "info-card | Title: Visit our blog;Link: https://example.com;External: true | bg-orange-200",
      serverinfo:
        "server-info | Server Name: Rap Battles; IP: 74.91.112.155:27015; Quick Join URL: steam://connect/74.91.112.155:27015 | bg-red-200",
      admincommand:
        "admin-command | Command: !kick; Description: Kick a player | bg-blue-200",
      eventlog:
        "event-log | Event: Player joined; Description: Player1 joined the server | bg-gray-200",
      patchnotes:
        "patch-notes | Version: 1.2.3; Notes: Fixed bugs and added new features | bg-yellow-200",
      serverrules:
        "server-rules | Rule: No cheating; Description: Cheating will result in a ban | bg-red-200",
      communityspotlight:
        "community-spotlight | Player: Player1; Achievement: Top scorer of the month | bg-green-200",
      warningalert:
        "warning-alert | Warning: Server maintenance; Description: Server will be down for maintenance | bg-red-500",
      neutralalert:
        "neutral-alert | Note: Update available; Description: A new update is available | bg-yellow-300",
      steamprofile:
        "steam-profile | URL: https://steamcommunity.com/id/player1; Display: Player1 | bg-blue-200",
      playercommand:
        "player-command | Command: !surf; Description: Start surfing | bg-gray-200",
      bugtracker:
        "bug-tracker | Bug: Map glitch; Status: Reported | bg-red-200",
      achievement:
        "achievement | Player: Player1; Achievement: Completed all maps | bg-blue-200",
      serverschedule:
        "server-schedule | Event: Weekly tournament; Time: Every Friday at 8 PM | bg-purple-200",
      newmap:
        "new-map | Map: surf_newmap; Description: A new surf map added to the rotation | bg-green-200",
      serverperformance:
        "server-performance | Metric: CPU Usage; Value: 75% | bg-yellow-200",
      moderationactions:
        "moderation-actions | Action: Ban; Player: Player1; Reason: Cheating | bg-red-200",
      mediagallery:
        "media-gallery | Media: https://example.com/image1.jpg; Description: Community event | bg-gray-200",
      customcommands:
        "custom-commands | Command: !wave; Description: Wave to everyone | bg-blue-200",
      achievementunlocks:
        "achievement-unlocks | Player: Player1; Achievement: Unlocked all badges | bg-green-200",
      rankingsystem:
        "ranking-system | Rank: 1; Player: Player1; Points: 1000 | bg-indigo-200",
      rankingpoints:
        "ranking-points | Points: 1000; Description: Points for completing maps | bg-teal-200",
      textstyle: "textstyle | Stylish Text | text-xl italic underline",
      spacing: "spacing | Content with spacing | m-4 p-2",
    };

    const newElement = parseContent(placeholder[type])[0];
    setElements([...elements, newElement]);
    setSearchTerm("");
    setDropdownVisible(false); // Dismiss the dropdown
  };

  const [isActualMobileDevice, setIsActualMobileDevice] = useState(false); // State to track if the user is on an actual mobile device

  // Determine initial view based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setView('mobile');
        setIsActualMobileDevice(true);
        setViewport({ width: 375, height: 812 });
      } else if (window.innerWidth < 1024) {
        setView('tablet');
        setIsActualMobileDevice(false);
        setViewport({ width: 768, height: 1024 });
      } else {
        setView('desktop');
        setIsActualMobileDevice(false);
        setViewport({ width: 1440, height: 900 });
      }
    };

    
        handleResize(); // Set the initial view
        window.addEventListener('resize', handleResize);
    
        return () => window.removeEventListener('resize', handleResize);
      }, []);

  const handleViewChange = (view: string) => {
    setView(view);
    switch (view) {
      case "mobile":
        setViewport({ width: 375, height: 812 });
        break;
      case "tablet":
        setViewport({ width: 768, height: 1024 });
        break;
      case "desktop":
        setViewport({ width: 1440, height: 900 });
        break;
      default:
        setViewport({ width: 375, height: 812 });
    }
  };

  const filteredElements = [
    "header",
    "paragraph",
    "image",
    "list",
    "code",
    "accordion",
    "achievement",
    "achievementunlocks",
    "admincommand",
    "alert",
    "bugtracker",
    "card",
    "carousel",
    "changelog",
    "code",
    "communityspotlight",
    "countdown",
    "customcommands",
    "datavisualization",
    "eventlog",
    "faq",
    "feature",
    "gallery",
    "infocard",
    "leaderboard",
    "mediagallery",
    "modal",
    "moderationactions",
    "neutralalert",
    "newmap",
    "patchnotes",
    "playercommand",
    "progress",
    "rankingpoints",
    "rankingsystem",
    "serverinfo",
    "serverperformance",
    "serverrules",
    "serverschedule",
    "spacing",
    "stats",
    "steamprofile",
    "tab",
    "table",
    "testimonial",
    "textstyle",
    "warningalert",
    "youtube",
  ].filter((type) => type.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleClickAway = (e: MouseEvent) => {
    if (
      !(e.target as HTMLElement).closest(".add-element-block") &&
      !(e.target as HTMLElement).closest(".dropdown-menu")
    ) {
      setDropdownVisible(false);
    }
  };


  useEffect(() => {
    document.addEventListener("click", handleClickAway);
    const handleScroll = () => {
      const addElementBlock = document.querySelector(".add-element-block");
      if (addElementBlock) {
        const rect = addElementBlock.getBoundingClientRect();
        setDropdownPosition({ top: rect.bottom, left: rect.left });
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("click", handleClickAway);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  const handleDropdownToggle = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom, left: rect.left });
    setDropdownVisible(!dropdownVisible);
  };




  const [isModalVisible, setModalVisible] = useState(false);
  const modalRef = useRef<HTMLElement | null>(null);
  
  function useClickAwayListener(ref: React.RefObject<HTMLElement>, callback: () => void) {
      useEffect(() => {
          function handleClickOutside(event: MouseEvent) {
              if (ref.current && !ref.current.contains(event.target as Node)) {
                  callback();
              }
          }
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
              document.removeEventListener("mousedown", handleClickOutside);
          };
      }, [ref, callback]);
  }
  
  useClickAwayListener(modalRef, () => hideModal());
  
  const showModal = () => {
      setModalVisible(true);
  };
  
  const hideModal = () => {
    if (modalRef.current) {
      modalRef.current.classList.add('modal-leave');
    }
    setTimeout(() => setModalVisible(false), 300);
  };

  
  const generateSyntax = () => {
    if (elements.length === 0) {
      return null;
    }
  
    return elements.map(element => {
      const content = 'content' in element && element.content ? element.content.toString().replace(/,/g, '; ') : '';
      const style = 'style' in element ? element.style : '';
      return `${element.type} | ${content} | ${style}`;
    }).join('\n');
  };
  
  const syntax = generateSyntax();
  
  const copySyntax = () => {
      if (syntax !== null) {
          navigator.clipboard.writeText(syntax);
          alert('Syntax copied to clipboard');
      } else {
          alert('No syntax to copy');
      }
  };



  return (
    <div className="outer-container">
      <div className="">
      <MenuBar
          isDimensionsEnabled={isDimensionsEnabled}
          setDimensionsEnabled={setDimensionsEnabled}
          isRulerEnabled={isRulerEnabled}
          setRulerEnabled={setRulerEnabled}
          isLayoutZoomEnabled={isLayoutZoomEnabled}
          setLayoutZoomEnabled={setLayoutZoomEnabled}
          isActualMobileDevice={isActualMobileDevice} // Pass the prop
        />
        {isDimensionsEnabled && (
          <ViewToolbar
            onViewChange={handleViewChange}
            viewport={viewport}
            setViewport={setViewport}
            isDimensionsEnabled={isDimensionsEnabled}
            isLayoutZoomEnabled={isLayoutZoomEnabled}
          />
        )}
        <Toolbar showModal={showModal} />
        {isRulerEnabled && <DimensionRuler viewport={viewport} />}
        <div className="preview-container">
          <div
            className="viewport"
            style={{
              width: view === "desktop" ? "100%" : `${viewport.width}px`,
              height: view === "desktop" ? "100%" : `${viewport.height}px`,
            }}
          >
            <div className="content-container">
              {elements.length === 0 ? (
                <div className="empty-state select-none">
                  No elements added. Use the button below to add elements.
                </div>
              ) : (
                renderContent(elements)
              )}
            </div>
            <div className="add-element-block select-none" onClick={handleDropdownToggle}>
              <span>Add Element</span>
              {dropdownVisible && (
                <div
                  className="dropdown-menu"
                  style={{
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="search-bar"
                    onClick={(e) => {
                      e.stopPropagation();
                      const input = e.currentTarget.querySelector("input");
                      if (input) {
                        input.focus();
                      }
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search elements..."
                      value={searchTerm}
                      className="select-none"
                      onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        setSearchTerm(target.value);
                      }}
                    />
                  </div>
                  <div className="dropdown-menu-items select-none">
                    {filteredElements.map((type, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          insertElement(type);
                          setDropdownVisible(false);
                        }}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal modal-enter" ref={modalRef as React.RefObject<HTMLDivElement>}>
            <div className="modal-header">
              <h2>Custom Syntax</h2>
              <span className="modal-close" onClick={hideModal}>&times;</span>
            </div>
            <div className="modal-content">
            {syntax ? (
    <pre>{syntax}</pre>
  ) : (
    <div className="empty-state select-none">No syntax available</div>
  )}
            </div>
            <button onClick={copySyntax} className="copy-button" disabled={!syntax ? true : false}>Copy Syntax</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default EditorModule;
