import { Box } from "@/components/ui/box";
import { useShoppingListContext } from "@/service/store";
import { useRouter } from "expo-router";
import { Text, View, FlatList, Pressable } from "react-native";
import HistoryItem from "@/components/HistoryItems";
import { SelectedItemType } from "@/service/state";
import { Card } from "@/components/ui/card";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import { Heading } from "@/components/ui/heading";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionContentText,
  AccordionIcon,
  AccordionContent,
} from "@/components/ui/accordion";
import { Divider } from "@/components/ui/divider";
import { ChevronUpIcon, ChevronDownIcon } from "@/components/ui/icon";
import { useEffect, useState } from "react";
import { CategoryItemResponseType, ShoppingItemTypes } from "@/service/types";
import { getAllCatalogItems } from "@/db/EntityManager";
import { useSQLiteContext } from "expo-sqlite";
import {
  formatDate,
  transformToCategoryItemResponse,
} from "@/Util/HelperFunction";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal"
import { Button, ButtonText } from "@/components/ui/button";

type AntDesignIconName = keyof typeof AntDesignIcon.glyphMap;

type SortOrFilterOption = {
  name: "Selected" | "Purchased" | "All" | "Flagged";
  iconName: AntDesignIconName; // icon name as string
  count: number;
};

export default function History() {
  const { state, dispatch } = useShoppingListContext();
  const { shoppingItemLists } = state;
  const [previewItem, setPreviewItem] = useState<ShoppingItemTypes[] | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [filteredItemsResult, setFilteredItemsResult] = useState<
    CategoryItemResponseType[]
  >([]);

  const router = useRouter();
  const db = useSQLiteContext();

  const selectedItemsNotPurchased = shoppingItemLists.filter(
    (item) => item.selected && !item.purchased
  );

  const selectedItemsAndPurchased = shoppingItemLists.filter(
    (item) => !item.selected && item.purchased
  );

  const selectedItemsNotPurchasedAndOverDue = shoppingItemLists.filter(
    (item) => Date.now() > new Date(item.createDate).getTime()
  );

  const allItems = shoppingItemLists;

  const sortFilterOptions: SortOrFilterOption[] = [
    {
      name: "Selected",
      iconName: "check",
      count: selectedItemsNotPurchased.length,
    },
    {
      name: "Purchased",
      iconName: "shoppingcart",
      count: selectedItemsAndPurchased.length,
    },
    {
      name: "All",
      iconName: "appstore-o",
      count: selectedItemsNotPurchasedAndOverDue.length,
    },
    { name: "Flagged", iconName: "flag", count: allItems.length },
  ];

  useEffect(() => {
    const fetchCategoryItems = async () => {
      const fullCategoryItems: CategoryItemResponseType[] =
        await getAllCatalogItems(db);

      // Transform the items
      const transformed: CategoryItemResponseType[] =
        transformToCategoryItemResponse(
          selectedItemsNotPurchased,
          fullCategoryItems
        );

      // Deduplicate by `value` (or `label` if you prefer)
      const uniqueItemsMap = new Map<string, CategoryItemResponseType>();
      transformed.forEach((item) => {
        if (!uniqueItemsMap.has(item.value)) {
          uniqueItemsMap.set(item.value, item);
        }
      });

      const uniqueItems = Array.from(uniqueItemsMap.values());

      setFilteredItemsResult(uniqueItems);
    };

    fetchCategoryItems();
  }, []);

  const handleOnPress = async (type: string) => {
    router.push({
      pathname: "/history/HistoryList",
      params: { filterType: type },
    });
  };

  const findItemByLabel = (label: string): ShoppingItemTypes[] => {
    return shoppingItemLists.filter(
      (item) =>
        typeof item.name === "string" &&
        item.name.toLowerCase() === label.toLowerCase()
    );
  };

  // const findItemByLabel = (label: string): ShoppingItemTypes[] => {
  //   return shoppingItemLists.filter((item) =>
  //     item.name.toLowerCase() === label.toLowerCase() ||
  //     (item.key === "" && item.selected === false && item.purchased === true)
  //   );
  // };

  // const groupByDate = (items: SelectedItemType[]) => {
  //   return items
  //     .map(cleanUpItem) // 👈 clean up first
  //     .filter(item => {
  //       const lastPurchased = item.purchased[item.purchased.length - 1];
  //       return lastPurchased === true;
  //     })
  //     .reduce((acc, item) => {
  //       const lastCreateDate = new Date(
  //         item.modifiedDate[item.modifiedDate.length - 1]
  //       )
  //         .toISOString()
  //         .split("T")[0];

  //       if (!acc[lastCreateDate]) acc[lastCreateDate] = [];
  //       acc[lastCreateDate].push(item);

  //       return acc;
  //     }, {} as Record<string, SelectedItemType[]>);
  // };

  //const groupedItems = groupByDate(shoppingItemLists);
  return (
    <VStack>
      <Box
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 20,
          padding: 10,
        }}
      >
        {sortFilterOptions.map((it, index) => (
          <Card
            key={index}
            style={{
              width: 150,
              padding: 10,
              borderRadius: 10,
              backgroundColor: "#ffffff",
            }}
          >
            <Pressable onPress={() => handleOnPress(it.name)}>
              <HStack className="justify-between">
                {/* <Icon as={it.iconName} size="md" /> */}
                <AntDesignIcon size={25} name={it.iconName} color="#888" />
                <Heading size="lg">{it.count}</Heading>
              </HStack>
              <Heading size="lg" className="mt-2">
                {it.name}
              </Heading>
            </Pressable>
          </Card>
        ))}
      </Box>
      <VStack space="lg" className="p-8">
        <Heading>Grouped By Item</Heading>
        <Accordion
          size="lg"
          variant="filled"
          type="single"
          isCollapsible={true}
          isDisabled={false}
          className="m-2 w-[95%] border border-outline-300"
        >
          {filteredItemsResult.map((items, index) => (
              <AccordionItem value="a" key={index}>
                <AccordionHeader>
                  <AccordionTrigger>
                    {({ isExpanded }) => {
                      return (
                        <>
                          <AccordionTitleText>{items.label}</AccordionTitleText>
                          <HStack space="md">
                            <Text>{findItemByLabel(items.label).length}</Text>
                            {isExpanded ? (
                              <AccordionIcon
                                as={ChevronUpIcon}
                                className="ml-3"
                              />
                            ) : (
                              <AccordionIcon
                                as={ChevronDownIcon}
                                className="ml-3"
                              />
                            )}
                          </HStack>
                        </>
                      );
                    }}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  <Pressable
                    onPress={() => {
                      setPreviewItem(findItemByLabel(items.label));
                      setShowPreviewModal(true);
                    }}
                  >
                  {findItemByLabel(items.label).map((it, idx) => {
                    const status = it.selected
                      ? "Selected"
                      : it.purchased
                      ? "Purchased"
                      : "";
                    const formattedDate = formatDate(it.createDate);
                    return (
                      <HStack
                        key={idx}
                        space="lg"
                        style={{
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingVertical: 5,
                          borderBottomWidth: 1.5,
                          borderColor: "#ddd",
                        }}
                      >
                        <Text className="text-md font-medium">{status}</Text>
                        <Text className="text-gray-600 text-sm">
                          {formattedDate}
                        </Text>
                      </HStack>
                    );
                  })}
                  </Pressable>
                </AccordionContent>
              </AccordionItem>
          ))}
        </Accordion>
      </VStack>
      <Modal isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)}>
        <ModalContent>
          {/* <ModalHeader>Item Snapshot</ModalHeader> */}
          <ModalBody>
            {previewItem?.map((item, index) => (
              <VStack key={index} space="sm" className="mb-2">
                <Text>Status: {item.selected ? "Selected" : "Purchased"}</Text>
                <Text>Date: {formatDate(item.createDate)}</Text>
                <Text>Qty: {item.quantity} {item.qtyUnit}</Text>
                {item.note ? <Text>Note: {item.note}</Text> : null}
              </VStack>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setShowPreviewModal(false)}>
              <ButtonText>Close</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

// For the groups here, have header,  sub header - count, Subsection tag with date completed, sort by most recent
