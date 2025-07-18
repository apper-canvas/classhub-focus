import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "card-premium rounded-xl p-6 hover-lift",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;