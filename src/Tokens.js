import React from "react";
import { useEffect } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Step, StepContent, StepLabel } from "@mui/material";
import axios from "axios";

import {
	Card,
	CardHeader,
	Avatar,
	Button,
	Modal,
	Typography,
	Stepper,
} from "@mui/material";

import "@rainbow-me/rainbowkit/styles.css";

import {
	darkTheme,
	getDefaultWallets,
	RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { ConnectButton, lightTheme } from "@rainbow-me/rainbowkit";

const { chains, provider } = configureChains(
	[chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
	[publicProvider()]
);

const { connectors } = getDefaultWallets({
	appName: "My RainbowKit App",
	chains,
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

export default function Tokens(props) {
	const networks = {
		1: "Ethereum",
		137: "Polygon",
		42161: "Arbitrum",
		10: "Optimism",
	};

	const [network, setNetwork] = React.useState("0");
	const [tokens, setTokens] = React.useState([]);
	const [filteredTokens, setFilteredTokens] = React.useState([]);
	const [query, setQuery] = React.useState("");
	const [token, setToken] = React.useState(null);
	const [step, setStep] = React.useState(0);

	const updateStep = async (token) => {
		setToken(token);
		if (!token) return;
		setStep(0);
		console.log(wagmiClient.status);
		if (wagmiClient.status == "connected") {
			setStep(1);
		}
		if ((await wagmiClient.connector.getChainId()) == token.chainId) {
			setStep(2);
		} else {
			await wagmiClient.connector.connect(token.chainId);
			setStep(2);
		}
		await window.ethereum.request({
			method: "wallet_watchAsset",
			params: {
				type: "ERC20", // Initially only supports ERC20, but eventually more!
				options: {
					address: token.address, // The address that the token is at.
					symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
					decimals: token.decimals, // The number of decimals in the token
					image: token.logoURI, // A string url of the token logo
				},
			},
		});
		setStep(3);
	};

	useEffect(() => {
		const fetch = async () => {
			const data = await axios.get(
				"https://gateway.ipfs.io/ipns/tokens.uniswap.org"
			);
			setTokens(data.data.tokens);
			setFilteredTokens(data.data.tokens);
		};
		fetch();
	}, []);
	const onFilterChange = () => {
		const filtered = tokens.filter((token) => {
			if (network != 0 && token.chainId != network) return false;
			return (
				token.name.toLowerCase().includes(query.toLowerCase()) ||
				token.symbol.toLowerCase().includes(query.toLowerCase())
			);
		});
		setFilteredTokens(filtered);
	};
	useEffect(() => {
		onFilterChange();
	}, [query, network]);
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider chains={chains} theme={lightTheme()}>
				<div className="tokens">
					<Paper
						component="form"
						sx={{
							p: "2px 4px",
							display: "flex",
							alignItems: "center",
							width: "80%",
						}}>
						<InputBase
							sx={{ ml: 1, flex: 1 }}
							placeholder="Search Tokens"
							inputProps={{ "aria-label": "Search Tokens" }}
							onChange={(e) => {
								setQuery(e.target.value);
							}}
						/>
						<IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
							<SearchIcon />
						</IconButton>
						<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
						<select
							style={{
								border: "none",
								padding: "1rem",
							}}
							onChange={(e) => {
								setNetwork(e.target.value);
							}}>
							<option value="0" style={{ padding: "5rem" }}>
								All Networks
							</option>
							<option value="1" style={{ padding: "5rem" }}>
								Ethereum Mainnet
							</option>
							<option value="137">Polygon</option>
							<option value="10">Optimism</option>
							<option value="42161">Arbitrum</option>
						</select>
					</Paper>

					{filteredTokens.map((token, index) => (
						<Card
							style={{
								marginTop: "1rem",
								width: "80%",
							}}>
							<CardHeader
								avatar={<img style={{ height: "3rem" }} src={token.logoURI} />}
								action={
									<Button
										onClick={() => {
											updateStep(token);
										}}>
										Add
									</Button>
								}
								title={`${token.name} (${token.symbol})`}
								subheader={`${
									networks[token.chainId] || "Unsupported Network"
								} : ${token.address.substring(0, 6)}...${token.address.slice(
									-4
								)}`}
							/>
						</Card>
					))}
					{token && (
						<Modal
							open={token != null}
							onClose={() => {
								setToken(null);
								setStep(0);
							}}>
							<Paper
								style={{
									position: "absolute",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									width: 400,
									bgcolor: "background.paper",
									boxShadow: 24,
									p: 4,
									padding: "2rem",
								}}>
								<Typography variant="h6" gutterBottom>
									Add {token.name} to wallet
								</Typography>
								<Stepper activeStep={step} orientation="vertical">
									<Step>
										<StepLabel>Connect Wallet</StepLabel>
										<StepContent>
											<ConnectButton.Custom
												onConnectChange={({ isConnected, data }) =>
													updateStep(token)
												}>
												{({
													account,
													chain,
													openAccountModal,
													openChainModal,
													openConnectModal,
													mounted,
												}) => {
													return (
														<div
															{...(!mounted && {
																"aria-hidden": true,
																style: {
																	opacity: 0,
																	pointerEvents: "none",
																	userSelect: "none",
																},
															})}>
															{(() => {
																if (!mounted || !account || !chain) {
																	return (
																		<Button
																			variant="contained"
																			onClick={openConnectModal}
																			type="button">
																			Connect Wallet
																		</Button>
																	);
																}

																if (chain.unsupported) {
																	return (
																		<button
																			onClick={openChainModal}
																			type="button">
																			Wrong network
																		</button>
																	);
																}

																return (
																	<div style={{ display: "flex", gap: 12 }}>
																		<Button
																			onClick={openAccountModal}
																			type="button">
																			{account.displayName}
																		</Button>
																	</div>
																);
															})()}
														</div>
													);
												}}
											</ConnectButton.Custom>
											<Button onClick={() => updateStep(token)}>Next</Button>
										</StepContent>
									</Step>
									<Step>
										<StepLabel>Switch Network</StepLabel>
										<StepContent>
											Your wallet will now prompt for changing the network ...
											<br />
											<Button onClick={() => updateStep(token)}>Retry</Button>
										</StepContent>
									</Step>
									<Step>
										<StepLabel>Add Token</StepLabel>
										<StepContent>
											Your wallet will now prompt for adding the token...
											<br />
											<Button onClick={() => updateStep(token)}>Retry</Button>
										</StepContent>
									</Step>
									<Step>
										<StepLabel>Done</StepLabel>
										<StepContent>
											The token is added to your wallet!
											<br />
											Support the development of this project by donating to the
											project on{" "}
											<a href="https://gitcoin.co/grants/7016/add-token-to-wallet">
												Gitcoin
											</a>
										</StepContent>
									</Step>
								</Stepper>
							</Paper>
						</Modal>
					)}
				</div>
			</RainbowKitProvider>
		</WagmiConfig>
	);
}
