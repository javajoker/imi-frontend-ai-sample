import React, { JSX } from "react";
import { clsx } from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined" | "glass";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  interactive?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  as?: keyof JSX.IntrinsicElements;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  padding = "md",
  hover = false,
  interactive = false,
  rounded = "lg",
  shadow,
  as: Component = "div",
  className,
  ...props
}) => {
  // Base card styles
  const baseClasses = "bg-white border border-gray-200 transition-colors";

  // Variant styles
  const variantClasses = {
    default: "bg-white border-gray-200",
    elevated: "bg-white border-gray-200 shadow-elevated",
    outlined: "bg-white border-2 border-gray-300",
    glass: "glass border-white/20",
  };

  // Padding styles
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  // Rounded styles
  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  // Shadow styles (if not defined by variant)
  const shadowClasses = shadow
    ? {
        none: "",
        sm: "shadow-sm",
        md: "shadow-card",
        lg: "shadow-card-hover",
        xl: "shadow-xl",
      }[shadow]
    : "";

  // Hover styles
  const hoverClasses =
    hover || interactive
      ? "hover:shadow-card-hover transition-shadow duration-200"
      : "";

  // Interactive styles
  const interactiveClasses = interactive
    ? "cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    : "";

  // Combine all classes
  const cardClasses = clsx(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    roundedClasses[rounded],
    shadowClasses,
    hoverClasses,
    interactiveClasses,
    className
  );

  // Add keyboard accessibility for interactive cards
  const interactiveProps = interactive
    ? {
        role: "button",
        tabIndex: 0,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (props.onClick) {
              props.onClick(e as any);
            }
          }
        },
      }
    : {};

  return (
    <div className={cardClasses} {...interactiveProps} {...props}>
      {children}
    </div>
  );
};

// Card Header Component
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  divider?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  divider = false,
  className,
  ...props
}) => {
  const headerClasses = clsx(
    "flex items-center justify-between",
    divider && "pb-4 mb-4 border-b border-gray-200",
    className
  );

  return (
    <div className={headerClasses} {...props}>
      {children}
    </div>
  );
};

// Card Title Component
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "sm" | "md" | "lg" | "xl";
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  as: Component = "h3",
  size = "md",
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: "text-sm font-medium",
    md: "text-base font-semibold",
    lg: "text-lg font-semibold",
    xl: "text-xl font-bold",
  };

  const titleClasses = clsx("text-gray-900", sizeClasses[size], className);

  return (
    <Component className={titleClasses} {...props}>
      {children}
    </Component>
  );
};

// Card Content Component
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
  ...props
}) => {
  const contentClasses = clsx("text-gray-600", className);

  return (
    <div className={contentClasses} {...props}>
      {children}
    </div>
  );
};

// Card Footer Component
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  divider?: boolean;
  justify?: "start" | "center" | "end" | "between" | "around";
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  divider = false,
  justify = "end",
  className,
  ...props
}) => {
  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };

  const footerClasses = clsx(
    "flex items-center space-x-2",
    divider && "pt-4 mt-4 border-t border-gray-200",
    justifyClasses[justify],
    className
  );

  return (
    <div className={footerClasses} {...props}>
      {children}
    </div>
  );
};

// Card Image Component
interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: "square" | "video" | "photo" | "auto";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  position?: "top" | "bottom" | "left" | "right";
}

export const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  aspectRatio = "auto",
  objectFit = "cover",
  position = "top",
  className,
  ...props
}) => {
  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    photo: "aspect-photo",
    auto: "",
  };

  const objectFitClasses = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  };

  const positionClasses = {
    top: position !== "top" ? "" : "-m-4 -mt-4 mb-4 rounded-t-lg",
    bottom: position !== "bottom" ? "" : "-m-4 -mb-4 mt-4 rounded-b-lg",
    left: position !== "left" ? "" : "-m-4 -ml-4 mr-4 rounded-l-lg",
    right: position !== "right" ? "" : "-m-4 -mr-4 ml-4 rounded-r-lg",
  };

  const imageClasses = clsx(
    "w-full",
    aspectRatioClasses[aspectRatio],
    objectFitClasses[objectFit],
    positionClasses[position],
    className
  );

  const containerClasses =
    position === "top" || position === "bottom"
      ? position === "top"
        ? "-m-4 -mt-4 mb-4"
        : "-m-4 -mb-4 mt-4"
      : "";

  if (position === "top" || position === "bottom") {
    return (
      <div className={containerClasses}>
        <img src={src} alt={alt} className={imageClasses} {...props} />
      </div>
    );
  }

  return <img src={src} alt={alt} className={imageClasses} {...props} />;
};

export default Card;
