import './App.css';
import Layout from './Layout'
import Tokens from './Tokens';

function App() {
  return (
    <Layout
      logo={require('./logo.png')}
      headerColor="#FFEA11"
      appName="Add Token to Wallet"
      appSubtitle="Cannot believe how hard it is to add a token to the wallet without this tool"
      repo="madhavanmalolan/addtokentowallet"
    >
      <Tokens />
    </Layout>
  );
}

export default App;
