# Secret-Monero-Bridge-Dapp
Secret Monero Bridge Decentralized Application

**Secret Monero Bridge Dapp v0.0.1:** https://ipfs.io/ipfs/Qmdy9Ups2Ru3ycKAiCre9zomRbFqgts1eAcvG43E2CcQTt/

The first release of the Secret Monero Bridge Dapp on the testnet for testing and evaluation purposes.Bridge fee for deposits and withdrawals is 0.0032 sXMR.

**How To Document:** https://github.com/scrtisland/secretxmr/blob/main/README.md

(Special thanks to **JC | SCRTisland** for compiling this document!)

The Dapp has been designed as an **unstoppable/uncensorable** application. It resides in IPFS and is not hosted on a centralized server. The Dapp does not interact with any centralized server.

The testnet Dapp's immutable hash ( **Qmdy9Ups2Ru3ycKAiCre9zomRbFqgts1eAcvG43E2CcQTt** ) will never change. The testnet Dapp content is mutable and can be versioned from within the immutable hash. Think of the immutable hash as an outer container that holds mutable content in an inner container. Any time the Dapp is versioned, the contents of the inner container are replaced with new content. This allows users to bookmark the immutable hash on an IPFS public gateway and never worry about the URL ever changing.

This design pattern also simplifies verifying software. Users don't have to perform SHA256 (SHAXXX) hashes to see if their hash matches a published hash to verify they have the approved package. User's don't have to deal with verifying RSA signatures, etc. IPFS is a content addressable storage system, if the content of an IPFS file chages, the hash changes. So as long as you verify the immutable hash of our Dapp you can be assured that the Dapp is legitimate and you are interacting with the authentic Secret Monero Bridge. This verification extends to all back-end components/services. No forked version of the Secret Monero Bridge can be hidden behind this Dapp. Attempting to do so would change the Dapp's immutable hash.
