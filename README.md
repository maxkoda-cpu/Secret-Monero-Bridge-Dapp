# Secret-Monero-Bridge-Dapp
Secret Monero Bridge Decentralized Application

The Secret Monero Bridge has been released on the Secret Network mainnet!

Blog post: https://scrt.network/blog/secret-monero-bridge-is-live-on-mainnet


**Secret Monero Bridge Dapp v0.0.1:** https://ipfs.io/ipfs/QmNRrLDhKGZCSXAZcPU1cBTaLouhWnTi5kfWUzJB4nJbzA

The decentralized web application is distributed over IPFS. It has been designed with an immutable hash (QmNRrLDhKGZCSXAZcPU1cBTaLouhWnTi5kfWUzJB4nJbzA) to load the mutable application code that can be versioned over time. The souce for the decentralized web application will be placed here in the github repository will be in a more readable form than that distributed over IPFS which is minimized to improve performance (while reducing readability).

**Keplr wallet behavior with our IPFS distribution**

Our Dapp enables the use of the Keplr wallet and the Keplr wallet asks users to authorize a domain for wallet access. This is a potential security risk which we have communicated as an issue at: https://github.com/chainapsis/keplr-extension/issues/136

The Keplr wallet extension effectively authorizes the domain of the IPFS public gateway to access the wallet. This is undesirable and presents the potential security risk. We have asked users to remove the IPFS public gateway authorization (Settings->Manage Connections) when they are finished using the Secret Monero Bridge Dapp. However, this measure is not satisfactory in that if the user forgets to do this, the security risk remains.

We will be releasing a simple utility application (written in the Go programming language) that loads the Dapp from localhost which will eliminate this security risk. The source code for the utility application will be maintained here. 
