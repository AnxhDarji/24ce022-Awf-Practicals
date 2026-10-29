import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Footer from './components/Footer';

function App() {
  const skills = ['HTML', 'CSS', 'JavaScript', 'React'];

  return (
    <div className="page">
      <Header name="Ansh" themeColor="#2563eb" />
      <main className="content">
        <About name="Ansh" />
        <Skills skillList={skills} />
      </main>
      <Footer email="ansh@example.com" />
    </div>
  );
}

export default App;
