import PropTypes from "prop-types";
import { Tooltip } from "antd";

const SocialIcons = ({ Icons }) => {
  return (
    <div className="text-secondary">
      {Icons.map((icon) => (
        <Tooltip key={icon.name} title={icon.title} color="#ffff">
          <a className="mx-1.5 inline-flex cursor-pointer items-center rounded-full border-2 border-secondary p-2 text-xl shadow-[0_0_5px_2px] shadow-primary bg-white">
            <ion-icon name={icon.name}></ion-icon>
          </a>
        </Tooltip>
      ))}
    </div>
  );
};

export default SocialIcons;

SocialIcons.propTypes = {
  Icons: PropTypes.array,
};
