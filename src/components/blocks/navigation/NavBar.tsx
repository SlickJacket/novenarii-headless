import { getNavbarData } from '@/lib/shopify/navigation';
import NavbarClient from '../navigation/NavBarClient';

export default async function Navbar() {
    // Fetch dynamic types and genders from Shopify via navigation.ts
    const navData = await getNavbarData();

    return <NavbarClient data={navData} />;
}