import * as React from "react";
import Twitter from "./twitter.svg";
import Medium from "./medium.svg";
import Github from "./github.svg";

export interface SocialIcon {
  src: string;
  url: string;
  alt: string;
}

const socialIcons: SocialIcon[] = [
  { src: Twitter, url: "https://twitter.com/EyalEizenberg", alt: "Twitter" },
  { src: Github, url: "https://github.com/eyaleizenberg", alt: "Github" },
  { src: Medium, url: "https://medium.com/@eyaleizenberg", alt: "Medium" }
];

export const SocialIcon = React.memo(({ icon }: { icon: SocialIcon }) => (
  <a href={icon.url}>
    <div className="icon-container">
      <img src={icon.src} alt={icon.alt} />
    </div>
    <style jsx>{`
      .icon-container {
        background-color: #f39c12;
        border-radius: 50%;
        padding: 6px;
        width: 40px;
        height: 40px;
      }
      img {
        width: 20px;
        height: 20px;
      }
    `}</style>
  </a>
));

export const SocialIcons = () => (
  <div className="social-container">
    {socialIcons.map((socialIcon, index) => (
      <SocialIcon icon={socialIcon} key={index} />
    ))}
    <style jsx>{`
      .social-container {
        display: flex;
        justify-content: space-evenly;
      }
    `}</style>
  </div>
);
