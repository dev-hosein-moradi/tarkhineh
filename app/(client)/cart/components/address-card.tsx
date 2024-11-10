import { Button } from "@/components/ui/button";
import { onOpen } from "@/hooks/use-address-modal";
import { IAddress } from "@/types";
import { Edit3Icon, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";

interface AddressCardState {
  data: IAddress;
  key: number;
  selectedAddress: string;
  handleSelectAddressToDelete: (id: string) => void;
  handleSelectAddress: (id: string) => void;
}

const AddressCard: React.FC<AddressCardState> = ({
  data,
  selectedAddress,
  handleSelectAddressToDelete,
  handleSelectAddress,
}) => {
  const dispatch = useDispatch();

  const handleOpenAddressModal = (id?: string) => {
    dispatch(onOpen(id || null));
  };

  return (
    <div
      onClick={() => handleSelectAddress(data.id)}
      className={`${
        selectedAddress === data.id ? " border-main" : " border-gray-300"
      } cursor-pointer flex flex-col gap-3 justify-between border border-1 items-end duration-150 rounded-md sm:w-[45%]  px-4 py-2`}
    >
      <div className="w-full flex flex-row-reverse gap-2">
        <h2 className="w-full text-right text-sm" dir="rtl">
          {data.content.slice(0, 55)}
          {data.content.length > 55 && "..."}
        </h2>
        <div className="flex flex-row gap-1 ">
          <Button
            onClick={() => handleSelectAddressToDelete(data.id)}
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
