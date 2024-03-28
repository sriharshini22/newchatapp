import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  View,
} from "@aws-amplify/ui-react";
import NextLink from "next/link";

const RoomList = ({ handleMenuToggle, rooms = [] }) => {
  return (
    <View>
      <Table variation="striped" highlightOnHover>
        <TableHead>
          <TableRow>
            <NextLink href="/">
              <TableCell as="th">Application Rooms</TableCell>
            </NextLink>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((room) => (
            <TableRow
              key={room.id}
              onClick={() => {
                console.log(room.id);
                handleMenuToggle(room.id);
              }}
            >
              <TableCell>{room.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </View>
  );
};

export default RoomList;
