# Secret-Monero-Bridge-Decentralized Application (Dapp)
Secret Monero Bridge Decentralized Application

The Secret Monero Bridge has been released on the Secret Network mainnet!

Blog post: https://scrt.network/blog/secret-monero-bridge-is-live-on-mainnet


**Secret Monero Bridge Dapp v0.0.1:** https://ipfs.io/ipfs/QmNRrLDhKGZCSXAZcPU1cBTaLouhWnTi5kfWUzJB4nJbzA

The decentralized web application is distributed over IPFS. It has been designed with an immutable hash (QmNRrLDhKGZCSXAZcPU1cBTaLouhWnTi5kfWUzJB4nJbzA) to load the mutable application code that can be versioned over time. The souce for the decentralized web application will be placed here in the github repository will be in a more readable form than that distributed over IPFS which is minimized to improve performance (while reducing readability).

**Secret Monero Bridge Decentralized Application IPFS hashes**

The more IPFS repositories that pin our IPFS content the more unstoppable and uncensorable the Secret Monero Bridge Dapp will be.
You can help us keep the Secret Monero Bridge Dapp unstoppable by pinning the following hashes in your IPFS repository:
* Secret Monero Bridge Dapp - Skeleton: QmNRrLDhKGZCSXAZcPU1cBTaLouhWnTi5kfWUzJB4nJbzA
* Secret Monero Bridge Dapp - Content: QmUg4CpT22u5TW9ie8tyXYXbifRCWFdMYu4TZpCFDST3UM
* Secret Monero Bridge Dapp - Master json file: QmWiAcKu2iUyLX2yroKoYLLVhRFHb3Myun8jERrZyo7eSr

If you pin these files in your IPFS repository it will help support the project!

**Keplr wallet behavior with our IPFS distribution**

Our Dapp enables the use of the Keplr wallet and the Keplr wallet asks users to authorize a domain for wallet access. This, paired with our approach to distributing our Dapp over IPFS is a potential security risk which we have communicated as an issue at: https://github.com/chainapsis/keplr-extension/issues/136

The Keplr wallet extension effectively authorizes the domain of the IPFS public gateway to access the wallet. This is undesirable and presents the potential security risk. We have asked users to remove the IPFS public gateway authorization (Settings->Manage Connections) when they are finished using the Secret Monero Bridge Dapp. However, this measure is not satisfactory in that if the user forgets to do this, the security risk remains.

We will be releasing a simple Electron application that loads the Dapp from localhost which will eliminate this security risk. The source code for the utility application will be maintained here. 
