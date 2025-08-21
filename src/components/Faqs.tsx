import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "./ui/accordion";
import { useState } from "react";

export const Faqs = ({items}) => {

    const [openItems, setOpenItems] = useState();

    const toggleItem = (itemId) => {
        setOpenItems(prevOpenItem => 
            prevOpenItem === itemId ? null : itemId
        );
    };

    return(
        <>
        <section className="py-10" id="faqs">
        <div className="flex items-center justify-center gap-6 mt-4 mb-10">
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="text-center">
            <div className="text-3xl font-serif">Preguntas frecuentes</div>
          </div>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-muted-foreground mx-auto text-lg text-stone-600">
              ¿Te quedan dudas? Aquí te ayudamos un poco más.
            </p>
          </div>
        </div>

        <Accordion className="w-[80vw] space-y-2 items-center  justify-center mx-auto" type="single">
        {items.map((item) => {
          const isOpen = openItems == item.id;
          
          return (
            <AccordionItem key={item.id} value={item.id} className="border bg-white">
              <AccordionTrigger 
                onClick={() => toggleItem(item.id)}
                className="px-4 text-left hover:bg-gray-50 "
                data-state={isOpen ? "open" : "closed"}
              >
                <span className="font-semibold text-gray-700">{item.title}</span>
              </AccordionTrigger>
              
              {isOpen && (
                <AccordionContent className="px-4 py-3 bg-gray-50 ">
                  {item.content}
                </AccordionContent>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>


      </section>
        </>
    )
}
