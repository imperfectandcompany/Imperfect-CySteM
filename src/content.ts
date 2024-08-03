// src/content.ts

interface Content {
  header: {
    contactUs: string;
  };
  sections: {
    [id: number]: Section;  // Changed from string keys to numerical IDs
  };
  footer: {
    copyright: string;
    links: {
      href: string;
      label: string;
    }[];
  };
}

export interface CardVersion {
  versionId: number; // Unique identifier for this version
  title: string; // Title of the card for this version
  description: string; // Description for this version
  detailedDescription: string; // More detailed description for this version
  diffs?: string; // Optional serialized diff data between this and the previous version
  editedBy: number; // Identifier of the user who made the edit
  editDate: string; // Timestamp of when the edit was made
  changes?: string[]; // Array of change descriptions
}

export interface Card {
  id: number; // Unique identifier for the card
  imgSrc: string; // Source URL for the card's image
  versions: CardVersion[]; // Array of version objects, including the initial and all edits
  archived: boolean; // Flag to indicate if the card is archived
  staffOnly: boolean; // Flag to indicate if the card is only visible to staff
  category: number; // Category (section here) of the card to help in organizing
  slug: string; // URL slug for the card
  showImage?: boolean; // Optional flag to show or hide the image in UI
  matches: {
    title: boolean;
    description: boolean;
    detailedDescription: boolean;
  };
}

interface SectionVersion {
  versionId: number; // Unique identifier for this version - first version is initial creation
  title: string; // Title of the section for this version
  diffs?: string; // Optional serialized diff data between this and the previous version
  editedBy: number; // Identifier of the user who made the edit
  editDate: string; // Timestamp of when the edit was made
}

export interface Section {
  versions: SectionVersion[]; // Array of version objects, including the initial and all edits
  cards: Card[];
}

export const content: Content = {
  header: {
    contactUs: "Need help? Contact us!",
  },
  sections: {
    1: {
      versions: [
        {
          versionId: 1,
          title: "Server Rules",
          diffs: "", // Empty or null for initial version
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
        },
      ],
      cards: [
        {
          id: 1,
          imgSrc: "https://placehold.co/100x100.png?text=general-rules",
          versions: [
            {
              versionId: 1,
              title: "General Conduct",
              description: "Because chaos is only fun in moderation.",
              detailedDescription:
                "These are the current rules shown to players in-game using the command 'sm_rules' in console or !rules in chat.\n\n**No Spamming:** No excessive use of voice or text chat. No ear spam. No sound clips. No voice activation.\n**No interrupting:** Do not interrupt players while they are rapping. No adlibs.\n**No disruptive behavior:** Do not threaten or attack other players or IG staff. Don't be toxic.\n**No discrimination:** Do not attack or target anyone for their ethnicity, religion, sexual preference, or gender.\n**No use of offensive slurs:** Using or baiting offensive racial or homophobic slurs will result in a permanent ban.\n**No doxing:** Attempting to discover or provide the personal information of another player will result in a permanent ban.\n**No advertising:** Don't drop your Soundcloud, Twitch, YouTube, Instagram, etc. here. No links in names (only CS:GO item websites are permitted).",
              diffs: "", // Empty or null for initial version
              editedBy: 1,
              editDate: "2024-01-01T00:00:00Z",
            },
          ],
          archived: false,
          staffOnly: false,
          category: 1,
          slug: "",
          matches: {
            title: false,
            description: false,
            detailedDescription: false,
          },
        },
        {
          id: 2,
          imgSrc: "https://placehold.co/100x100.png?text=extended-mute-or-ban",
          versions: [
            {
              versionId: 1,
              title: "Extended Mute or Ban",
              description: "For those who really like to push the boundaries.",
              detailedDescription:
                "Severe server disruption; these infractions will result in an extended mute or ban.\n\n**Ban Words:** Saying, typing or baiting the hard R (N word) or the F word (rhymes with maggot) will result in a permanent ban, regardless of context.\n**Discrimination:** Imperfect Gamers strives to provide players with a safe and inclusive environment. Attacking or targeting any individual or peoples for their ethnicity, religion, sexual preference or gender is strictly forbidden and will result in removal from the community.\n**Doxxing:** Attempting to discover or provide the personal information of another member of the community will result in a permanent ban.\n**Advertisement & Promotion:** Imperfect Gamers is not your billboard. Don't drop your Soundcloud, Twitch, YouTube, Instagram, or any other socials here. If you want to share your socials with someone, add them and DM them. You are also allowed to have your socials in your Steam profile. Joining with a link in your player name will result in a kick on the first offense, and a ban on the second. The only exceptions to this are CS:GO item websites.\n**Ban Evasion:** If a ban is currently active on any of your accounts, connecting to IG servers on an alternate account will result in that account also being banned, an extension applied to your existing ban, and an IP ban for the duration. The use of VPNs or proxies is not allowed and will result in a ban.",
              diffs: "", // Empty or null for initial version
              editedBy: 1,
              editDate: "2024-01-01T00:00:00Z",
            },
          ],
          archived: false,
          staffOnly: false,
          category: 1,
          slug: "",
          matches: {
            title: false,
            description: false,
            detailedDescription: false,
          },
        },
        {
          id: 3,
          imgSrc:
            "https://placehold.co/100x100.png?text=minimum-30-minute-mute",
          versions: [
            {
              versionId: 1,
              title: "Minimum 30 Minute Mute",
              description: "When you need a little quiet time to reflect.",
              detailedDescription:
                "General server disruption; these infractions will result in a minimum 30 minute mute.\n\n**Spamming:** Spamming pertains to the excessive use of voice or text chat. Examples of text spam would be repeated use of chat binds, or constantly typing nonsense. Examples of voice chat include making repeated noises, playing sound clips, holding your mic button down for no reason or using voice activation. 'Ear Spam' also falls into this category.\n**Interruption:** In the same vein as voice spam, do not interrupt another member while they are rapping. Examples of interruption include asking to get on the mic because you want to rap, laughing at their lyrics, and adlibs.\n**Toxic Behavior:** Attacking, threatening or disrespecting other members or staff fall under this category. The exception to this rule is in the context of a rap battle. Punishments will range from a 30 minute mute to a permanent ban. The length is at the discretion of the Imperfect Gamers staff.",
              diffs: "", // Empty or null for initial version
              editedBy: 1,
              editDate: "2024-01-01T00:00:00Z",
            },
          ],
          archived: false,
          staffOnly: false,
          category: 1,
          slug: "",
          matches: {
            title: false,
            description: false,
            detailedDescription: false,
          },
        },
        {
          id: 4,
          imgSrc:
            "https://placehold.co/100x100.png?text=rapping-and-djing-rules",
          versions: [
            {
              versionId: 1,
              title: "Rapping and DJing Rules",
              description: "Because even mics need a break sometimes.",
              detailedDescription:
                "**Rapping and DJing:** Everyone is welcome to rap or play beats, and having a rapper or DJ tag is not required. If a beat is playing and no one is rapping, feel free to hop on. Similarly, if no beat is playing, feel free to throw one on.\n**Hogging the Mic:** Sometimes it is easy to get carried away while rapping; just remember to pass the mic once in a while. Typically, if there's other people that want to rap, try to keep your bars limited to 30 seconds.\n**Beats & Songs:** You are welcome to play your own beats, or beats you found online. While meme beats and actual songs aren't strictly against the rules, you should avoid playing them without expressed permission from a staff member currently on the server. Similarly, you are permitted to play full songs so long as everyone is okay with it. If people want you to turn it off, you should turn it off.\n**Writtens:** If you want to spit a written, you must ensure that the server is fine with it beforehand. Do not spit writtens without disclosing it first.\n**CallAdmin:** Inside the server, there is a command called '!calladmin'. This command is for reporting rule abusers. Any misuse of this command could result in a temporary ban. This command is only for reporting rule violations, not for general announcements or non-urgent messages. Please use it responsibly.",
              diffs: "", // Empty or null for initial version
              editedBy: 1,
              editDate: "2024-01-01T00:00:00Z",
            },
          ],
          archived: false,
          staffOnly: false,
          category: 1,
          slug: "",
          matches: {
            title: false,
            description: false,
            detailedDescription: false,
          },
        },
      ],
    },
    2: {
      versions: [
        {
          versionId: 1,
          title: "VIP Infractions",
          diffs: "", // Empty or null for initial version
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
        },
      ],
      cards: [
        {
          id: 5,
          imgSrc: "https://placehold.co/100x100.png?text=vip-infractions",
          versions: [
            {
              versionId: 1,
              title: "VIP Infractions",
              description:
                "Some people just want to watch the world burn... but not here.",
              detailedDescription:
                "**Abuse of VIP Perks:** Examples of abuse include, but are not limited to: - Exclusive VIP commands (sm_vipkick, sm_vipmute, etc) - VIP features such as skins, sounds or sprays - Manipulation of the in-game economy (buying/selling/trading items unfairly)\n**Fraudulent Activity:** Attempting to buy, sell, trade, or gift a VIP rank, or associated items, with real world money, will result in immediate removal from the VIP rank and a permanent ban from the community.\n**Misrepresentation:** Claiming to represent the Imperfect Gamers community, its staff, or its administration without proper authorization will result in immediate removal from the VIP rank and a permanent ban.\n**Terms of Service Violations:** Engaging in activities that violate our Terms of Service, including but not limited to: harassment, discrimination, hacking, exploiting, or any other actions deemed inappropriate by the community's administration.\n\nAll of these rules are subject to appeal/dispute inside the forums. If you have an issue with any staff member/person on the server, please get in contact with staff management.",
              diffs: "", // Empty or null for initial version
              editedBy: 1,
              editDate: "2024-01-01T00:00:00Z",
            },
          ],
          archived: false,
          staffOnly: false,
          category: 2,
          slug: "",
          matches: {
            title: false,
            description: false,
            detailedDescription: false,
          },
        },
      ],
    },
    3: {
      versions: [
        {
          versionId: 1,
          title: "Staff Guidelines",
          diffs: "", // Empty or null for initial version
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
        },
      ],
      cards: [
        {
          id: 6,
          imgSrc: "https://placehold.co/100x100.png?text=staff-guide-redux",
          versions: [
            {
              versionId: 1,
              title: "Imperfect Gamers Staff Guide Redux (2017)",
              description:
                "A gentle reminder on how not to become a digital tyrant.",
              detailedDescription:
                "Over the past few years, the ban process on Imperfect Gamers has been adjusted accordingly to better suit the interests of the players.\n\n**10/16/2017:** I've had several questions about how harsh you should be on people for various reasons. To answer this, it should be up to you. My only advice on this would be, that if it's intentionally something malicious, that deserves a more severe punishment. We do have the rule about the hard R being an instant ban, however less severe infractions often depend on the context, hence the point about maliciousness. If you are unsure about how harsh you should be to any situation, don't be shy to ask.\n**10/30/2017:** First of all welcome to everyone that's new. I just want to give a few reminders. If you ban someone, it might not show in chat. The ban went through if no error message shows up. Other players should be able to see the ban. Also, if you are unfamiliar with the commands, we have a google docs sheet with all the commands on it, plus some more stuff. If you need that sheet, contact me or Daiyaan. Finally, remember that punishment should be decided by you. Obviously make sure whatever you do is justifiable, because we do keep a watch. If we feel you are not giving punishment, or giving it beyond reason, you will be notified. With that being said, hard R should always be a ban. Really shouldn't ever be less than a week, unless the circumstance calls for it (like a misunderstanding). Anyway thanks for listening, us staff and Daiyaan are always here to help out. If you need anything, let us know!\n**Aug 9, 2017:** Due to an increasingly overwhelming number of ban-appeals on the discord it was then decided to move these applications somewhere more publicly accessible such as in the Steam group discussion.",
              diffs: "", // Empty or null for initial version
              editedBy: 1,
              editDate: "2024-01-01T00:00:00Z",
            },
          ],
          archived: false,
          staffOnly: false,
          category: 3,
          slug: "",
          matches: {
            title: false,
            description: false,
            detailedDescription: false,
          },
        },
        {
          id: 7,
          imgSrc: "https://placehold.co/100x100.png?text=ban-appeals",
          versions: [
            {
              versionId: 1,
              title: "Ban Appeals",
              description:
                "Because everyone deserves a second chance... or do they?",
              detailedDescription:
                "**Appeals:** Every mod is required to participate in the ban appeal discussion thread with proper etiquette.\n\n**Example Appeal Message:**\nHello, <username>\nI have investigated your appeal and the staff member who banned you put down <reason> as the reason that you were banned. Could you please elaborate on the circumstances of your ban?\nThanks,\n<username>\n\n**Staff Training:** Staff was trained to ensure a safe enough environment to check each-other regardless of position, and to ensure that the rules are being enforced properly. This is to ensure that the rules are being enforced properly and that the staff is not abusing their power.\n\n**Ban Appeals:** If you have been banned, you can appeal your ban on the forums. If you are unsure of how to do this, please ask a staff member for assistance. If you are a staff member and you are unsure of how to handle a ban appeal, please ask a higher-up staff member for assistance.\n\n**Ban Appeal Format:**\n\nUsername:\nWhen you got banned:\nWhy you got banned:\nPermanent Steam Profile URL:\nWhat was the situation before you got banned:\nWho banned you:\nAre you in the wrong or in the right:\nIf punishment is deserved provide an alternative you would like that you yourself think is fair.\n\nRemember, watch your thread after you post the appeal. Staff members may ask you questions about it.",
              diffs: "", // Empty or null for initial version
              editedBy: 1,
              editDate: "2024-01-01T00:00:00Z",
            },
          ],
          archived: false,
          staffOnly: false,
          category: 3,
          slug: "",
          matches: {
            title: false,
            description: false,
            detailedDescription: false,
          },
        },
      ],
    },
    4: {
      versions: [
        {
          versionId: 1,
          title: "Posting Guidelines",
          diffs: "", // Empty or null for initial version
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
        },
      ],
      cards: [
        {
          id: 8,
          imgSrc: "https://placehold.co/100x100.png?text=posting-guidelines",
          versions: [
            {
              versionId: 1,
              title: "Posting Guidelines",
              description:
                "Spreading your digital wings without crashing into the window.",
              detailedDescription:
                'Anybody with DJ or Rapper status is allowed to create one post on this forum to promote themselves, their material, social media, and other related works.\n\n**Only one thread allowed per artist.\n**"Bumping" the post is allowed weekly.\n**Users are allowed to respond and comment.\n**Posts are subject to general IG platform rules.',
              diffs: "", // Empty or null for initial version
              editedBy: 1,
              editDate: "2024-01-01T00:00:00Z",
            },
          ],
          archived: false,
          staffOnly: false,
          category: 4,
          slug: "",
          matches: {
            title: false,
            description: false,
            detailedDescription: false,
          },
        },
      ],
    },
    5: {
      versions: [
        {
          versionId: 1,
          title: "Admin Panel Guidelines",
          diffs: "", // Empty or null for initial version
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
        },
      ],
      cards: [
        {
          id: 9,
          imgSrc: "https://placehold.co/100x100.png?text=admin-panel-guide",
          versions: [
            {
              versionId: 1,
              title: "Admin Panel Guide",
              description:
                "Wielding your digital power responsibly... or just recklessly enough.",
              detailedDescription:
                "Here's a rundown of basic admin panel usage for new staff. Up to date as of 08-29-2019.\n\n**Logging in:** 1. Head over to the Bans page here. 2. In the top right hand corner, you will see a button that says 'admin'. Click this. This will take you to the login page. 3. If the Steam login does not work, then you need to have an account set up. Hit up Lew G and give him your email; he will add it to your SourceBans account and then you can do a 'forgot password' to set up the login info.\n**Adding a ban:** 1. Navigate to the admin panel by clicking on the 'admin panel' button on the navbar or by clicking here. 2. Click 'bans' or go here. 3. Click 'Add a ban'. 4. From here, you can add a ban on someone's community ID, steamid or by IP. Make sure you select the appropriate type of ban.\n**Editing a ban:** 1. Navigate to our bans page or click here. 2. Click on the ban you want to edit (or use advanced search to find it) 3. Click 'Edit Details'. 4. From here, you can change the length of the ban or remove the ban entirely.\n**Server management:** 1. Navigate to the servers page by clicking the 'servers' button on the navbar or by going here. 2. Click on a server to expand it. 3. Right click a player. 4. Click kick/ban/mute as needed.\n**An extra little note:** Steam ID Finder is a useful website for getting someone's steam/community IDs from their profile name.",
              diffs: "", // Empty or null for initial version
              editedBy: 1,
              editDate: "2024-01-01T00:00:00Z",
            },
          ],
          archived: false,
          staffOnly: false,
          category: 5,
          slug: "",
          matches: {
            title: false,
            description: false,
            detailedDescription: false,
          },
        },
      ],
    },
    6: {
      versions: [
        {
          versionId: 1,
          title: "Forum and Subscriptions",
          diffs: "", // Empty or null for initial version
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
        },
      ],
      cards: [
        {
          id: 10,
          imgSrc: "https://placehold.co/100x100.png?text=creating-a-new-thread",
          versions: [
            {
              versionId: 1,
              title: "Creating a New Thread",
              description:
                "Crafting your digital soapbox without getting splinters.",
              detailedDescription:
                "Make a new thread in this forum with the following formatting:\n\nUsername:\nWhen you got banned:\nWhy you got banned:\nPermanent Steam Profile URL:\nWhat was the situation before you got banned:\nWho banned you:\nAre you in the wrong or in the right:\nIf punishment is deserved provide an alternative you would like that you yourself think is fair.\n\nRemember, watch your thread after you post the appeal. Staff members may ask you questions about it.",
              diffs: "", // Empty or null for initial version
              editedBy: 1,
              editDate: "2024-01-01T00:00:00Z",
            },
          ],
          archived: false,
          staffOnly: false,
          category: 6,
          slug: "",
          matches: {
            title: false,
            description: false,
            detailedDescription: false,
          },
        },
      ],
    },
    7: {
      versions: [
        {
          versionId: 1,
          title: "Cheating Policy",
          diffs: "", // Empty or null for initial version
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
        },
      ],
      cards: [
        {
          id: 11,
          imgSrc: "https://placehold.co/100x100.png?text=cheating-policy",
          versions: [
            {
              versionId: 1,
              title: "Cheating Policy",
              description:
                "Cheaters never prosper, unless they're really good at it.",
              detailedDescription:
                "Cheating in any form is not allowed on any of our servers. This can include:\n\n**Cheating with hacking programs:** Using software or tools that alter the game to provide unfair advantages.\n**Cheating with injectors:** Injecting code or scripts to manipulate game behavior.\n**Cheating times:** Exploiting or manipulating in-game time records.\n**Anything that would give you an unfair advantage over other players:** Any actions or modifications that provide an unearned benefit over others.\n\nThis is not taken lightly as it is extremely severe. Cheating in any way is an automatic permanent ban with a minimum 6-month ban (after appeal).",
              diffs: "", // Empty or null for initial version
              editedBy: 1,
              editDate: "2024-01-01T00:00:00Z",
            },
          ],
          archived: false,
          staffOnly: false,
          category: 7,
          slug: "",
          matches: {
            title: false,
            description: false,
            detailedDescription: false,
          },
        },
      ],
    },
    8: {
      versions: [
        {
          versionId: 1,
          title: "Advanced Rules Menu",
          diffs: "", // Empty or null for initial version
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
        },
      ],
      cards: [
        {
          id: 12,
          imgSrc:
            "https://placehold.co/100x100.png?text=advanced-rules-menu-example",
          versions: [
            {
              versionId: 1,
              title: "Advanced Rules Menu Example",
              description:
                "Navigating the bureaucratic labyrinth of server rules.",
              detailedDescription:
                "Example:\n\n{% interactive %}\n> sm_addrule_name No surfing or rapping\n  \"Successfully set the ongoing created rule's name to No surfing or rapping\"\n> sm_addrule_desc Surfing or rapping of any kind is strictly prohibited and will result in a ban.\n  \"Successfully set the ongoing created rule's name to Surfing or rapping of any kind is strictly prohibited and will result in a ban.\"\n> (Now select 'Add a rule' from the rule management menu)\n  \"Rule was successfully added.\"\n{% endinteractive %}\n\n**Multi-line descriptions:**\nIf you want to do multi-line descriptions, you can do so with '/n' (no quotes). For example: sm_addrule_desc This is a/n description\n\n**Current rules menu template:**\n\n**sm_addrule_name No spamming** sm_addrule_desc No excessive use of voice or text chat. No ear spam. No sound clips. No voice activation.\n**sm_addrule_name No interrupting** sm_addrule_desc Do not interrupt players while they are rapping. No adlibs.\n**sm_addrule_name No disruptive behavior** sm_addrule_desc Do not threaten or attack other players or IG staff. Don't be toxic.\n**sm_addrule_name No discrimination** sm_addrule_desc Do not attack or target anyone for their ethnicity, religion, sexual preference or gender.\n**sm_addrule_name No hard R or F word** sm_addrule_desc Using or baiting the hard R (N word) or F word (rhymes with maggot) will result in a permanent ban.\n**sm_addrule_name No doxxing** sm_addrule_desc Attempting to discover or provide the personal information of another player will result in a permanent ban.\n**sm_addrule_name No advertising** sm_addrule_desc Don't drop your Soundcloud, Twitch, YouTube, Instagram, etc here. No links in names (only CS:GO item websites are permitted).\n**sm_addrule_name Detailed Rules & Guidelines** sm_addrule_desc For the detailed rules and guidelines of Imperfect Gamers, visit our forums.\nimperfectgamers.org/forum\n\n**General Information:**\nAny player can view the server rules by typing !rules (sm_rules) in chat. Additionally, if you want to force someone to view the rules, you can use !showrules (sm_showrules). Example: !showrules <user>",
              diffs: "", // Empty or null for initial version
              editedBy: 1,
              editDate: "2024-01-01T00:00:00Z",
            },
          ],
          archived: false,
          staffOnly: false,
          category: 8,
          slug: "",
          matches: {
            title: false,
            description: false,
            detailedDescription: false,
          },
        },
      ],
    },
    9: {
      versions: [
        {
          versionId: 1,
          title: "Infractions and Stats",
          diffs: "", // Empty or null for initial version
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
        },
      ],
      cards: [
        {
          id: 13,
          imgSrc: "https://placehold.co/100x100.png?text=infractions-and-stats",
          versions: [
            {
              versionId: 1,
              title: "Infractions and Stats",
              description:
                "Where the rubber meets the road in server law enforcement.",
              detailedDescription:
                "For any moderators or admins, using your STAFF tag is preferred.\n\nDJ and RAPPER tags should only be given to well qualified candidates. This is per admin discretion. We want active players that promote the type of environment that Imperfect Gamers is known for. When in doubt, don't give out DJ/RAPPER tags. Consult at least one other STAFF before awarding DJ/RAPPER tags to somebody. A DJ should have at least 2 months of activity and promoting 'the party'. RAPPERS should have at least 2 months of experience and have won rap battles.\n\n**ADMINS ONLY:**\n\nDo not give out tags for 'free' - doing so is considered admin abuse and will result in loss of privileges.",
              diffs: "", // Empty or null for initial version
              editedBy: 1,
              editDate: "2024-01-01T00:00:00Z",
            },
          ],
          archived: false,
          staffOnly: false,
          category: 9,
          slug: "",
          matches: {
            title: false,
            description: false,
            detailedDescription: false,
          },
        },
      ],
    },
    10: {
      versions: [
        {
          versionId: 1,
          title: "Server Commands",
          diffs: "", // Empty or null for initial version
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
        },
      ],
      cards: [
        {
          id: 14,
          imgSrc: "https://placehold.co/100x100.png?text=general-commands",
          versions: [
            {
              versionId: 1,
              title: "General Commands",
              description:
                "For when you need to do something but don't know how to do it manually.",
              detailedDescription:
                "**sm_avg:** Display the average time of the current map\n**sm_b, sm_bonus:** Teleports player to the start of a bonus (sm_b 1, sm_b 2, etc)\n**sm_back, sm_rs, sm_stuck:** Teleports player back to the start of the current stage\n**sm_bhop:** Toggle autobhop on/off\n**sm_bonuses:** Displays a list of bonuses in current map\n**sm_bonustop, sm_btop:** Displays top rankings of the bonuses\n**sm_brank:** Displays a players bonus record in chat\n**sm_cpr:** Compare clients time to another clients time\n**sm_delspawn, sm_resetstartpos:** [zoner] Removes custom !r position\n**sm_end:** Teleports player to the end zone\n**sm_goback, sm_gb:** Go back a stage\n**sm_goto:** Teleport to a given player\n**sm_loclist, sm_savelocs:** List saved locations\n**sm_m, sm_mapinfo, sm_maptier, sm_tier, sm_difficulty:** Displays map information in chat\n**sm_maphistory:** Shows the most recent maps played\n**sm_maptop, sm_mtop:** Displays server map top for a given map\n**sm_mi:** opens map improvement points panel\n**sm_mrank:** Displays a players map record in chat\n**sm_n, sm_normal:** Switches player back to normal mode\n**sm_p, sm_profile:** Opens a player profile\n**sm_pause:** On/off pause (timer on hold and movement frozen)\n**sm_pr:** Displays pr menu to client\n**sm_prac, sm_practice, sm_loadloc:** Teleports player to their last checkpoint\n**sm_r, sm_restart, sm_start, sm_spawn:** Teleports player back to the start\n**sm_rank:** Displays a players server rank in the chat\n**sm_ranks:** Displays a menu with available player ranks\n**sm_rb, sm_rr, sm_latest:** Displays latest map records\n**sm_repeat:** Toggles stage repeating\n**sm_s, sm_stage:** Teleports player to the selected stage\n**sm_saveloc, sm_cp:** Creates a checkpoint which the player can teleport to\n**sm_selfmute, sm_sm:** Mute player\n**sm_selfunmute, sm_su:** Unmute player\n**sm_showzones:** Shows map zones\n**sm_spec, sm_spectate, sm_watch:** Spectate a player\n**sm_specbot:** Spectate the map bot\n**sm_specbotb, sm_specbotbonus:** Spectate the bonus bot\n**sm_stages:** Opens the stage selector\n**sm_startpos:** Saves current location as new start position\n**sm_stop:** Stops the surf timer\n**sm_style, sm_styles:** Open styles menu\n**sm_surftimer, sm_timer, sm_options, sm_settings:** Surftimer settings menu\n**sm_tele, sm_teleport:** Teleports player to his last checkpoint\n**sm_togglecheckpoints:** On/off - Enable player checkpoints\n**sm_toggletimer:** Toggles timer on and off\n**sm_top, sm_topsurfers:** Displays top rankings (Top 100 Players, Top 50 overall)\n**sm_wr:** Displays the SR in chat\n**sm_wrb:** Displays bonus SR in chat\n**sm_wrcp, sm_wrcps:** Displays stage records for map",
              diffs: "", // Empty or null for initial version
              editedBy: 1,
              editDate: "2024-01-01T00:00:00Z",
            },
          ],
          archived: false,
          staffOnly: false,
          category: 10,
          slug: "",
          matches: {
            title: false,
            description: false,
            detailedDescription: false,
          },
        },
      ],
    },
  },

  footer: {
    copyright: "© 2024 Imperfect Gamers. All rights reserved.",
    links: [
      { href: 'https://imperfectgamers.org/', label: 'Home' },
      { href: 'https://store.imperfectgamers.org/', label: 'Store' },
      { href: 'https://stats.imperfectgamers.org/', label: 'Stats' },
    ],
  },
};
