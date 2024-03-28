import { Flex, Menu, useBreakpointValue } from "@aws-amplify/ui-react";
import { useState } from "react";
import RoomList from "../RoomList";

const ConversationDisplay = ({
  rooms = [],
  isMenuOpen,
  setIsMenuOpen,
  variation,
  toggleMenu,
}) => {
  if (variation === "isMobile") {
    return (
      <Flex>
        <Menu
          isOpen={isMenuOpen}
          menuAlign="start"
          onOpenChange={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <RoomList rooms={rooms} handleMenuToggle={toggleMenu} />
        </Menu>
      </Flex>
    );
  } else if (variation === "isTabletOrHigher") {
    return <RoomList rooms={rooms} handleMenuToggle={toggleMenu} />;
  }
};

const ConversationBar = ({ rooms = [], onRoomChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const variation = useBreakpointValue({
    base: "isMobile",
    medium: "isTabletOrHigher",
  });
  const toggleMenu = (roomId) => {
    setIsMenuOpen(false);
    onRoomChange(roomId);
  };
  return (
    <ConversationDisplay
      rooms={rooms}
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      variation={variation}
      toggleMenu={toggleMenu}
    />
  );
};

export default ConversationBar;
