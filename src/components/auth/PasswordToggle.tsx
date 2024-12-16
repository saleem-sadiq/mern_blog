import { FC, HTMLAttributes } from "react";
// Components
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface IProps extends HTMLAttributes<HTMLButtonElement> {
  value: boolean;
}

const PasswordToggle: FC<IProps> = ({ className, value, ...props }) => {
  return (
    <button type="button" className={cn("", className)} {...props}>
      {value ? (
        <EyeOff className="cursor-pointer opacity-30 " size={20}/>
      ) : (
        <Eye className="cursor-pointer opacity-30" size={20}/>
      )}
    </button>
  );
};

export default PasswordToggle;
