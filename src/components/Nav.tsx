import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { SquareTerminal, Bot, Code2, Book, Settings2 } from 'lucide-react';
import { Button } from './ui/button';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

type NavItem = {
    icon: React.ComponentType<{ className?: string }>;
    ariaLabel: string;
    tooltip: string;
    route: string; // Add route property
};

type NavProps = {
    navItems: NavItem[];
};

const defaultNavItems: NavItem[] = [
    { icon: SquareTerminal, ariaLabel: "Playground", tooltip: "Playground", route: "/playground" },
    { icon: Bot, ariaLabel: "Models", tooltip: "Models", route: "/models" },
    { icon: Code2, ariaLabel: "API", tooltip: "API", route: "/api" },
    { icon: Book, ariaLabel: "Documentation", tooltip: "Documentation", route: "/documentation" },
    { icon: Settings2, ariaLabel: "Settings", tooltip: "Settings", route: "/settings" },
];

export default function Nav({ navItems = defaultNavItems }: NavProps) {
    const location = useLocation();
    const activeRoute = location.pathname;

    return (
        <TooltipProvider>
            <nav className="grid gap-1 p-2">
                {navItems.map((item, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <Link to={item.route}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn('rounded-lg', { 'bg-muted': activeRoute === item.route })}
                                    aria-label={item.ariaLabel}
                                >
                                    <item.icon className="size-5" />
                                </Button></Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            {item.tooltip}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </nav>
        </TooltipProvider>
    );
}