import { CursorPresence } from "../components/cursor-presence";
import "../routes/cs.css";
import { useState, type MouseEvent } from "react";

export default function CV() {
  const [copyMessage, setCopyMessage] = useState("");
  const [copiedAt, setCopiedAt] = useState<{ x: number; y: number } | null>(null);

  async function copyUrl(text: string, event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;

    setCopiedAt(null);
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage("Copied to clipboard.");
      setCopiedAt({ x, y });
    } catch {
      setCopyMessage("Could not copy to clipboard.");
    }
  }

  return (
      <div className="cv-page">
        <CursorPresence />
        <h1>Alexis Baker</h1>

        <h4><button type="button" className="copyable" onClick={(event) => copyUrl("jobs@alexis.org.uk", event)}>jobs@alexis.org.uk</button> | <a style={{ color: 'blue' }} href="https://www.linkedin.com/in/etelan/" target="_blank" rel="noopener noreferrer">LinkedIn</a> (<button type="button" className="copyable" onClick={(event) => copyUrl("https://www.linkedin.com/in/etelan/", event)}>etelan</button>)</h4>

        {copiedAt && (
          <span
            className="copiedBox"
            style={{ left: copiedAt.x, top: copiedAt.y }}
            aria-hidden="true"
            onAnimationEnd={() => setCopiedAt(null)}
          >
            Copied
          </span>
        )}

        <h4>Bury St Edmunds, IP33 1JT</h4>
        <br/>

        <p>I am currently a Full Stack Developer at Songkick / Warner Media Group. Songkick's role is to provide near real-time information and pricing for live music event tickets from a broad network of ticketing suppliers. Songkick is a regional team, with the headquarters based in London, but with people working from Spain, Turkey, Wales and Scotland. I have experience with Ruby on Rails, Node.js, and Kubernetes due to a microservice architecture. Worked with BigQuery for large scale data analysis from our Export Transform Load jobs. React, Embedded Ruby (ERB), JavaScript (some TypeScript), CSS and HTML on the frontend. ERB is the Ruby Templating System which allows reusing and embedding of Ruby (and Javascript) code into HTML documents. Passed my AWS CLF-C02 Exam on Friday 24th July 2026, after revising for over half a year.</p>
        <br/>
        <p>I led the new search modal work on Songkick. Additionally, I had a large input into the design of the React work for the search carousel and results retrieval on the website. The core search functionality was based on Elasticsearch and I built the React component to interface with that platform. This meant communicating with the Design team to implement desktop and mobile Figma designs, ensuring the modal's reactivity with the backend API, while maintaining brand consistency, while meeting accessibility (a11y) standards. </p>
        <br/>

        <h2>Experience</h2>
        <h3>Full Stack Developer - Songkick / Warner Media Group: October 2022 to Present</h3>
        <ul>
          <li>Integrated data feeds from a broad network of ticketing suppliers and partners, ensuring support with our systems.</li>
          <li>React.js frontend. Iterating, developing and designing the search modal, integrating Figma designs and QA feedback.</li>
          <li>Agile development, with standups, Kanban Boards (Shortcut), sprints, and retrospectives.</li>
          <li>Wrote Investigation Documents, Product Requirement Documents, Engineering Design Docs, and Documentation around existing code. Reviewed by Songkick and Warner teams.</li>
          <li>Used Cucumber for end-to-end BDD testing and Rspec for BDD unit testing.</li>
          <li>Implemented dynamic frontend components that work with API's to ensure Asynchronous State Handling during loading, error, and success states</li>
          <li>Used BigQuery usage in order to check bugs with certain data, metrics, and specific client requests</li>
          <li>Benchmarked and optimized critical backend functions, reducing execution time by 90% (7.1s → 0.73s). Combination of Pagination Changes and Association Mapping / Caching via Preloading.</li>
        </ul>
        <br/>

        <h3>Software Engineering Apprentice - Google UK: September 2020 to 2022</h3>
        <ul>
          <li>Worked on backend database features, improving my skills in PostgreSQL, and Java for Android Development</li>
          <li>Worked on patches to Google Fit App for Android and Android Wear. Fixing accessibility and UI issues</li>
          <li>Implemented Timezone Calculation Optimisations for Android Health Connect</li>
          <li>Experience with migrations to new libraries</li>
          <li>Writing clear and concise documentation for coworkers with regard to  testing</li>
          <li>Organised headline talkers at TransConf 2021 at Google</li>
        </ul>
        <br/>

        <h3>The Melbourn Community Hub App: July 2019 - March 2020</h3>
        <ul>
          <li>The Hub Android App - GML for Mobile Development</li>
          <li>Designed and implemented a rewards system, including password hashing and encryption of saved reward values</li>
          <li>Communicated with clients, stakeholders and testers to assess software requirements</li>
          <li>Kept in contact with stakeholders during the development process, including feedback for prototypes</li>
          <li>Wrote planning and other development documents</li>
        </ul>
        <br/>

        <h2>Personal Projects</h2>
        <h3>Home Dashboard (2023-Present)</h3>
        <ul>
          <li>HomeAssistant, Python, and custom integrations</li>
          <li>Control Panel with physical buttons and dials connected to a Raspberry Pi Zero W running my custom Python Server to run automations</li>
          <li>Monitoring and controlling lights and plug sockets across my home</li>
          <li>Currently working on surfacing my DIY Home Solar Setup’s Data on my dashboard with full battery detection for my e-bike</li>
          <li>Integrates temperature sensors from Raspberry Pi Zero W for real time room temperature tracking. Replacement of temperature sensors needed as the margin of error for temperature is too wide.</li>
        </ul>
        <br/>

        <h3>Minecraft Trainline Website (2022)</h3>
        <ul>
          <li>Uses Spring Boot for the API</li>
          <li>Raw HTML and CSS for frontend</li>
          <li>On Error, Loading, and Success states for the frontend</li>
          <li>Lua with a Minecraft Mod in order for me to send data to my API</li>
          <li>Realtime web viewable updates on in-game train locations</li>
        </ul>
        <br/>

        <h2>Education</h2>
        <h3>A-Levels</h3>
        <ul>
          <li>The Oakes College, Cambridge</li>
          <li>Maths: A</li>
          <li>IT: Distinction Star (A*)</li>
          <li>Media: Distinction Star (A*)</li>
        </ul>
        <br/>

        <h2>Personal Interests</h2>
        <ul>
          <li>Playing Dungeons and Dragons as the Dungeon Master and as a player</li>
          <li>Programming games for Game Jams</li>
          <li>Playing VR games and animations using Oculus Rift/Quest</li>
          <li>Meeting up with friends to play boardgames including “One Night Ultimate Werewolf”, “Settlers of Catan” and “Betrayal at House on the Hill”</li>
          <li>Long Walks and Photography</li>
        </ul>
      </div>  
  );
}
