import { cn } from '@/lib/utils';
// import { BellIcon } from '@heroicons/react/24/solid';
import BurgerIcon from '@/components/BurgerIcon';

interface LogoProps {
    iconSize?: string;
    textSize?: string;
    onlyIcon?: boolean;
}

export default function Logo({ iconSize = 'size-12', textSize = 'text-5xl', onlyIcon = false }: LogoProps) {
    return (
        <div className="flex gap-1 items-center text-black">
            {/*<BellIcon className={iconSize} />*/}
            <BurgerIcon className={iconSize} />
            {!onlyIcon && <p className={cn('font-[Righteous]', textSize)}>TableTap</p>}
        </div>
    )
}