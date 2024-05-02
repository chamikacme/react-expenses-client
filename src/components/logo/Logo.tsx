const Logo = ({ size }: { size?: string }) => {
  return (
    <div className={"font-sans" + (size ? ` ${size}` : " text-3xl")}>
      <span>Fin</span>
      <span className="text-primary font-extrabold">Track</span>
    </div>
  );
};

export default Logo;
