import React from "react";
import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableRow,
  TableData,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionIcon,
  AccordionContent,
} from "@/components/ui/accordion";
import { Heading } from "./ui/heading";
import { ChevronDownIcon, ChevronUpIcon } from "./ui/icon";
import { Divider } from "./ui/divider";
import { ShoppingItem } from "@/service/state";
import { cleanUpItem, formatDate } from "@/Util/HelperFunction";
import { Box } from "./ui/box";
import { Text } from "./ui/text";
import { Button, ButtonText } from "./ui/button";
import { SelectedItemType } from "@/service/state";

type Props = {
  shoppingItems: ShoppingItem[];
  id: string;
  onEditItems: (purchase: ShoppingItem) => void; 
};


const HistoryActivity = ({ shoppingItems, id, onEditItems }: Props) => {
  const item = shoppingItems.find((entry: ShoppingItem) => entry.key === id);

  const cleanedItem = item ? cleanUpItem(item) : undefined;

  const combinedPurchases = cleanedItem?.createDate.map((date, index) => ({
    createDate: new Date(date),
    quantity: cleanedItem.quantity[index],
    price: cleanedItem.price[index],
    priority: cleanedItem.priority[index],
    purchased: cleanedItem.purchased[index],
    selected: cleanedItem.selected[index],
    modifiedDate: new Date(cleanedItem.modifiedDate[index]),
    qtyUnit: cleanedItem.qtyUnit[index],
    key: cleanedItem.key,
    name: cleanedItem.name,
    category: cleanedItem.category,
    id: cleanedItem.id,
  }));

  const sortedPurchases = combinedPurchases?.sort(
    (a, b) => b.modifiedDate.getTime() - a.modifiedDate.getTime()
  );

  const wrapAsShoppingItem = (item: SelectedItemType): ShoppingItem => ({
    id: item.id,
    key: item.key,
    name: item.name,
    quantity: [item.quantity],
    qtyUnit: [item.qtyUnit],
    price: [item.price],
    purchased: [item.purchased],
    selected: [item.selected],
    createDate: [item.createDate.toISOString()],
    modifiedDate: [item.modifiedDate.toISOString()],
    priority: [item.priority],
    category: item.category,
  });

  return (
    <Card className="mt-2">
      <Heading>Activities</Heading>
      <Accordion
        size="lg"
        variant="filled"
        type="single"
        isCollapsible={true}
        isDisabled={false}
        className="my-3 w-[100%] border border-outline-200"
      >
        {sortedPurchases?.map((purchase, idx) => (
            <Box key={idx}>
            <AccordionItem value="a" >
            <AccordionHeader>
              <AccordionTrigger>
                {({ isExpanded }) => {
                  return (
                    <>
                       <AccordionTitleText className="text-xl">
                        Purchased - {formatDate(purchase.modifiedDate)}
                      </AccordionTitleText>
                      {isExpanded ? (
                        <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                      ) : (
                        <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                      )}
                    </>
                  );
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              <Table className="w-full">
                <TableBody>
                  <TableRow>
                    <TableData>Quantity</TableData>
                    <TableData>{purchase.quantity}</TableData>
                  </TableRow>
                  <TableRow>
                    <TableData>Quantity Unit</TableData>
                    <TableData>{purchase.qtyUnit}</TableData>
                  </TableRow>
                  <TableRow>
                    <TableData>Price</TableData>
                    <TableData>{purchase.price}</TableData>
                  </TableRow>
                  <TableRow>
                    <TableData>Priority</TableData>
                    <TableData>{purchase.priority}</TableData>
                  </TableRow>
                </TableBody>
              </Table>
              <Box className="my-3">
                <Heading>Notes</Heading>
                <Text>
                The Examples section provides visual representations of the different variants of the component, allowing you to quickly and easily determine which one best fits your needs. Simply copy the code and integrate it into your project.
                </Text>
              </Box>
              <Box className="my-3">
                <Heading>Attachments</Heading>
              </Box>
              <Divider/>
              <Box>
              <Button
                  size="sm"
                  variant="outline"
                  onPress={() => onEditItems?.(wrapAsShoppingItem(purchase))}
                  className="mt-4 self-end"
                >
                  <ButtonText>
                  Edit Entry
                  </ButtonText>
                </Button>
              </Box>
            </AccordionContent>
          </AccordionItem>
            <Divider />
            </Box>

        ))}
      </Accordion>
    </Card>
  );
};
export default HistoryActivity;
