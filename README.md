# Secret-Monero-Bridge-Decentralized Application (Dapp)
Secret Monero Bridge Decentralized Application

The Secret Monero Bridge has been released on the Secret Network mainnet!

Blog post: https://scrt.network/blog/secret-monero-bridge-is-live-on-mainnet


**Secret Monero Bridge Dapp v0.0.2:** https://ipfs.io/ipns/k51qzi5uqu5dhovcugri8aul3itkct8lvnodtnv2y3o1saotkjsa7ao1aq0dqa/

We had to deploy a new version of the Dapp after the exploit on the secret-2 chain because our immutable hash used https://api.secretapi.io to read the location of the current Dapp hash. https://api.secretapi.io still connects to the secret-2 chain which has been halted, thus the need to deploy a new immutable hash.


**Keplr wallet behavior with our IPFS distribution**

Our Dapp enables the use of the Keplr wallet and the Keplr wallet asks users to authorize a domain for wallet access. This, paired with our approach to distributing our Dapp over IPFS is a potential security risk which we have communicated as an issue at: https://github.com/chainapsis/keplr-extension/issues/136

The Keplr wallet extension effectively authorizes the domain of the IPFS public gateway to access the wallet. This is undesirable and presents the potential security risk. We have asked users to remove the IPFS public gateway authorization (Settings->Manage Connections) when they are finished using the Secret Monero Bridge Dapp. However, this measure is not satisfactory in that if the user forgets to do this, the security risk remains.

We will be releasing a simple Electron application that loads the Dapp from localhost which will eliminate this security risk. The source code for the Electron application will be maintained here. 
