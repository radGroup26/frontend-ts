// components.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const LogoutButton = ({ handleLogout }: { handleLogout: (event: React.FormEvent<HTMLFormElement>) => void }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <form onSubmit={handleLogout}>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn('rounded-lg')}
                    aria-label='logout button'
                >
                    <LogOut className="size-5" />
                </Button>
            </form>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
            Logout
        </TooltipContent>
    </Tooltip>
);