interface HeadingProps {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-gradient ">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
