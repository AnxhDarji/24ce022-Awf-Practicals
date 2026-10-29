function Header({ name, themeColor }) {
  return (
    <header className="header" style={{ backgroundColor: themeColor }}>
      <p className="eyebrow">Student Portfolio</p>
      <h1>Hello, I am {name}</h1>
    </header>
  );
}

export default Header;
