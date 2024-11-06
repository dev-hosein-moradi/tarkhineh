import { Button } from "@/components/ui/button";
import { onOpen } from "@/hooks/use-address-modal";
import { IAddress } from "@/types";
import { Edit3Icon, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";

interface AddressCardState {
  data: IAddress;
  key: number;
}

const AddressCard: React.FC<AddressCardState> = ({ data }) => {
  const dispatch = useDispatch();
  const handleOpenAddressModal = (id?: string) => {
    console.log("clicked!");
    dispatch(onOpen(id || null));
  };
  return (
    <div className="flex flex-col gap-3 justify-between items-end border hover:border-main duration-150 rounded-md w-[45%] px-4 py-2">
      <div className="w-full flex flex-row-reverse gap-2">
        <h2 className="w-full text-right text-sm">{data.content}</h2>
        <div className="flex flex-row gap-1 ">
          <Button
            size="icon"
            variant="ghost"
            className="border hover:bg-error-extra-light duration-150"
          >
            <Trash2 className="w-4 h-4 text-gray-700" />
          </Button>
          <Button
            onClick={() => handleOpenAddressModal(data.id)}
            size="icon"
            variant="ghost"
            className="border"
          >
            <Edit3Icon className="w-4 h-4 text-gray-700" />
          </Button>
        </div>
      </div>
      <div className="w-full flex flex-row-reverse items-center justify-between">
        <p className="text-gray-500 text-xs">{data.title}</p>
        <p className="text-gray-500 text-xs">{data.tel}</p>
      </div>
    </div>
  );
};

export default AddressCard;
