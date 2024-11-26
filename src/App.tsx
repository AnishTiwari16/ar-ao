import Arweave from 'arweave';
import Account from 'arweave-account';
import { useEffect, useState } from 'react';
import './App.css';
import Cards from './components/cards';
import Header from './components/header';
import { SquareArrowOutUpRight } from 'lucide-react';

export const arweave = Arweave.init({});
export const account = new Account({
    cacheIsActivated: true,
    cacheSize: 100,
    cacheTime: 3600000, // 3600000ms => 1 hour cache duration
});

function App() {
    const [transactions, setTransactions] = useState<
        { node: { id: string; owner: { address: string } } }[]
    >([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const queryObject = {
                query: `{
    transactions(recipients:["NUMygtth1T5LGKObzjFD76VnZymqFkpoJ51sMK5OBds"]) {
        edges {
            node {
                id
                owner {
                    address
                }
            }
        }
    }
}`,
            };

            try {
                const results = await fetch(
                    'https://arweave-search.goldsky.com/graphql',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(queryObject),
                    }
                );
                const res = await results.json();
                setTransactions(res.data.transactions.edges);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="text-white">
            <Header />
            <div className="h-px w-full bg-[#1e191d] mt-5" />
            <Cards />
            <div className="h-px w-full bg-[#1e191d]" />
            <div className="font-semibold text-lg px-12 py-5">
                Recent Activities
                {transactions.map((transaction) => (
                    <div className="font-medium text-[15px] py-1 w-full flex items-center">
                        {transaction.node.owner.address} {'  '}
                        placed a Bet
                        {'  '}
                        <a
                            href={`https://www.ao.link/#/message/${transaction.node.id}`}
                            target="target_blank"
                            rel="noreferrer"
                            className="cursor-pointer flex items-center gap-x-2 hover:underline"
                        >
                            {transaction.node.id.slice(0, 5) +
                                '...' +
                                transaction.node.id.slice(-5)}{' '}
                            <SquareArrowOutUpRight size={15} />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
