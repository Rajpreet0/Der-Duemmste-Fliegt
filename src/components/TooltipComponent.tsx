import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface TooltipComponentProps {
    children: React.ReactNode;
    content: string;
}

const TooltipComponent: React.FC<TooltipComponentProps> = ({content, children}) => {
  return (
    <Tooltip>
        <TooltipTrigger asChild>
            {children}
        </TooltipTrigger>
        <TooltipContent className="tracking-wider">
            {content}
        </TooltipContent>
    </Tooltip>
  )
}

export default TooltipComponent