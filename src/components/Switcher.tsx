import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect } from "react";


interface Option {
    name: string;
    value: string;
}

interface Props {
    isCollapsed: boolean,
    options: Option[] | undefined,
    selected: string | undefined,
    setSelected: Dispatch<SetStateAction<string | undefined>>
}

export default function Switcher({
    isCollapsed,
    options,
    selected,
    setSelected
}: Props) {
    useEffect(() => {
        // console.log('selectedz', selected);
    }, [selected]);

    // useEffect(() => {
    //     console.log('options', options);
    // }, [options])

    return (
        <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger
                className={cn(
                    "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
                    isCollapsed &&
                    "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
                )}
                aria-label="Select account"
            >
                <SelectValue placeholder="Select a restaurant">
                    {options?.length && (
                        <span className={cn("ml-2", isCollapsed && "hidden")}>
                            {options.find((item) => item.value === selected)?.name}
                        </span>
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {options?.length ? (
                    options.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                                {item.name}
                            </div>
                        </SelectItem>
                    ))
                ) : (
                    <SelectItem value="adas" disabled>Loading...</SelectItem>
                )}
            </SelectContent>
        </Select>
    )
}