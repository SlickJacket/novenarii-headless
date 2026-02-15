import ProductsGrid from "@/components/blocks/products/ProductsGrid";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    gender: string;
    type: string;
  }>;
}

// export default async function CategoryPage({ params }: PageProps) {
//   const { gender, type } = await params;

//   // Validation: Only allow our specific genders (and unisex)
//   const validGenders = ['male', 'female', 'unisex', 'men', 'women'];
//   if (!validGenders.includes(gender.toLowerCase())) {
//     return notFound();
//   }

//   // Clean up the "all" string for the API
//   // If type is 'all', we pass undefined to the grid so it shows everything for that gender
//   const productType = type === 'all' ? undefined : type;

//   // Formatting the title for the UI (e.g., "male" -> "Men")
//   const displayGender = gender.toLowerCase() === 'male' ? 'Men' : 
//                         gender.toLowerCase() === 'female' ? 'Women' : 
//                         gender.charAt(0).toUpperCase() + gender.slice(1);

//   const displayType = type === 'all' ? 'Collection' : type;

//   return (
//     <main className="w-full pt-32">
//       <header className="px-8 mb-12 max-w-7xl mx-auto text-center">
//         <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-2">
//           <span>Shop</span>
//           <span className="opacity-30">/</span>
//           <span>{displayGender}</span>
//         </div>
        
//         <h1 className="text-4xl font-light italic uppercase tracking-tight text-black">
//             {displayType}
//         </h1>
        
//         <div className="mt-4 h-[1px] w-12 bg-neutral-200 mx-auto" />
//       </header>

//       {/* Updated Grid: 
//           We no longer pass 'collectionHandle'. 
//           Instead, we pass 'gender' and 'productType'.
//       */}
//       <ProductsGrid 
//         gender={gender} 
//         productType={productType} 
//       />
//     </main>
//   );
// }

export default async function CategoryPage({ params }: { params: Promise<{ gender: string, type: string }> }) {
    const { gender, type } = await params;

    // This console log will show up in your TERMINAL (not browser)
    console.log("Routing Params:", { gender, type });

    return (
        <main className="pt-32">
            {/* Verify these match the props in ProductsGrid.tsx */}
            <ProductsGrid 
                gender={gender} 
                productType={type === 'all' ? undefined : type} 
            />
        </main>
    );
}