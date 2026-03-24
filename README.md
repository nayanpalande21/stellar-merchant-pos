#  Stellar Merchant POS

##  Overview

Stellar Merchant POS is a modern **crypto point-of-sale system** built on the Stellar Network that enables merchants to accept payments in **XLM instantly**.

The application provides a clean and user-friendly interface where merchants can generate payment requests, and customers can pay using their Stellar wallets. The system automatically detects transactions on-chain and confirms payments in real-time.

---

##  Problem

Retail stores and small businesses lack simple tools to accept cryptocurrency payments. Existing blockchain solutions are often complex, slow, and not designed for everyday merchant use.

---

##  Solution

Stellar Merchant POS simplifies crypto payments by providing:

-  Simple and intuitive payment interface  
-  Instant blockchain verification  
-  Real-time payment confirmation  

This makes crypto payments as seamless as UPI or card transactions.

---

##  Features

###  Core Features (Level 5)

- Generate payment requests  
- Real-time payment detection via Stellar blockchain  
- Instant transaction confirmation  
- Transaction history display  
- Copy wallet address functionality  
- Input validation (prevents invalid payments)  
- Premium UI (glassmorphism + animated stars)

---

###  UX Enhancements

- Animated “Checking Blockchain” loader  
- Payment success feedback  
- Transaction counter  
- Testnet usage warning  

---

###  Iteration Improvements (Based on Feedback)

- Added copy-to-clipboard wallet feature  
- Improved UI clarity and consistency  
- Prevented duplicate transaction detection  
- Enhanced success message visibility  

---

##  System Architecture

Frontend (Next.js)
↓
Stellar SDK
↓
Horizon API
↓
Stellar Blockchain
↓
Payment Detection Logic


---

##  Architecture Document

Detailed system design available here:  
 [architecture.md](./architecture.md)

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS  
- **Blockchain:** Stellar Network (Horizon API)  
- **Library:** stellar-sdk  
- **Wallet:** Freighter Wallet  

---

##  Live Demo

 https://stellar-merchant-pos-uaao.vercel.app/

---

## Demo Video

https://youtu.be/EbWxDq_z3sc

---

##  Screenshots

###  Home Page
![Home](./screenshots/home-page.png)

###  Wallet Connection
![Wallet](./screenshots/walletconnection.png)

###  Payment Request
![Payment](./screenshots/payment-request.png)

###  On-Chain Proof
![Onchain](./screenshots/onchain-proof.png)

###  Payment Success
![Success](./screenshots/payment-successful.png)

---

##  Test Users (Stellar Wallets)

+--------+--------------------------------------+------------------------------------------------------------------+--------+------------------------------------------------------------------------------------------------------------------+
| Sr No  | Email                                | Account                                                          | XLM    | Link                                                                                                             |
+--------+--------------------------------------+------------------------------------------------------------------+--------+------------------------------------------------------------------------------------------------------------------+
| 1      | sujaypalande24022001@gmail.com       | GCLHTHMOVW3J6O3IVLZWMWDONMLPONJTR6QSLI2SSBWAKB44IKJE3ES2         | 4 XLM  | https://stellar.expert/explorer/testnet/tx/039fe9f84d3870053f1daee4e22145135dafa814a4e8cb03fe3d1f0c0d674501     |
| 2      | cdhasal23@gmail.com                  | GDJCKA3JG2BUJO5LJLD66DATXE4HCJG62XPLFJKNJRVQSBA3IPB2BWQ2         | 1 XLM  | https://stellar.expert/explorer/testnet/tx/e0c6804ece42cdca09b43c32ef87afc42ebeaa945709a796a9cd8a6cf9fad863     |
| 3      | vaibhavijadhav856@gmail.com          | GBYUTGCNPXOLSHPZ6SCJQCCS3GSYLE2MXQQO6DFUQ2E7G4Y4NKSL2PFQ         | 2 XLM  | https://stellar.expert/explorer/testnet/tx/e73b3d1d1618c134b0759735ba989975f59954e33de2d7e15d55277734dc8cb0     |
| 4      | manashulle@gmail.com                 | GDRWXCQ3IN3ZFXOKIPICFI2D7GERUQ4GEGISRGWND5VHQCXLO54YZ3JK         | 5 XLM  | https://stellar.expert/explorer/testnet/tx/a3b762f938268320135f06e6ae8a13aa5bb35795fe4678d782672b81c443d4ec     |
| 5      | sayalin2006@gmail.com                | GCLTDFYMDJZYLDKETB6Z24CCPHGFQS7NRZFJWT4AUXQZ5SF2BJOME7CN         | 1 XLM  | https://stellar.expert/explorer/testnet/tx/cfad61525f39202b91244e7e480ea63f7c75188af733ffae801b086fef1ff32c     |
+--------+--------------------------------------+------------------------------------------------------------------+--------+------------------------------------------------------------------------------------------------------------------+


---

All users successfully completed payments using the application interface.  
Each transaction was processed in real-time and verified on the Stellar Testnet blockchain, demonstrating the reliability and correctness of the payment system.

---

##  Transaction Proof (Testnet)

Below are real transaction screenshots captured during testing:

### User 1 (4 XLM)
![User1](./screenshots/tx-user1.png)

### User 2 (1 XLM)
![User2](./screenshots/tx-user2.png)

### User 3 (2 XLM)
![User3](./screenshots/tx-user3.png)

### User 4 (5 XLM)
![User4](./screenshots/tx-user4.png)

### User 5 (1 XLM)
![User5](./screenshots/tx-user5.png)

---

##  On-Chain Verification (Stellar Explorer)

Below is proof of transactions verified on the Stellar Testnet blockchain using Stellar Expert.

![OnChain Explorer](./screenshots/onchain-explorer-proof.png)



---

##  User Feedback

- **User 1:** Easy to use and clean UI  
- **User 2:** Payment confirmation is extremely fast and reliable  
- **User 3:** On-chain transaction visibility significantly increased user confidence in the system
- **User 4:** UI looks modern, premium, and professional  
- **User 5:** Clear instructions improved usability for testnet users  

---


## Improvements Based on Feedback

- Added “Tap to Copy” wallet feature  
- Improved success message visibility  
- Added testnet usage warning  
- Enhanced UI responsiveness  

---

##  Why This Project Matters

This project demonstrates real-world adoption of blockchain in retail.

Unlike theoretical projects, this MVP:

-  Has real users  
-  Processes real blockchain transactions  
-  Solves a practical business problem  

It bridges the gap between crypto and everyday commerce.

---

##  Future Enhancements (Level 6)

- Analytics dashboard (revenue, transactions)  
- Multi-merchant support  
- Fee sponsorship (gasless payments)  
- Multi-signature payment approval  
- Cross-border payments  
- Real-time transaction streaming (WebSockets)  
- Database integration (Supabase)  
- User analytics (DAU, retention)  

---

##  Note

This project uses **Stellar Testnet only**.  
No real funds are involved.

---

##  Conclusion

Stellar Merchant POS showcases how blockchain can power real-world retail payments with speed, security, and simplicity.

---
