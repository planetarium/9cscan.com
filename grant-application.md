# Grant Application

## Project Description
Development and operation of Nine Chronicles blockchain explorer

## Project Overview

**Key Features**
- Common features of blockchain explorer
  - Access and search the block data
  - Access and search the transaction data
  - Access and search the account data
- Customization for Nine Chronicles
  - NCG balance accessing
  - NCG current price displaying
  - Avatar data accessing
  - Action data filtering


**Key technical considerations**
- Consistent processing of huge size data
- Quick data access via index
- Real-time updates on the latest blocks
- Responsive web design to accommodate mobile and tablet devices

## Development Milestones
### Milestone 1 (1 Month)
- Week 1 : Nine Chronicles project analysis / 9c blockchain data analysis
- Week 2 : Service Layout & IA Design
- Week 3 : Design & Markup Web
- Week 4 : Implement Data Syncer
  - Self-operate 9c node
  - Design database structure and indexes
  - Implement 9c blockchain data syncer (9cnode -> DB)

### Milestone 2 (1 Month)
- Week 1~2 : API development & WebSocket setup
  - Includes all key features of project overview.
- Week 3~4 : Front-end development
  - Includes all key features of project overview.
  - Support responsive web for mobile.
  - Support real-time updates through WebSocket.

### Open Beta

### Milestone 3 (1 Month)
- Week 1~2 : Improve each features
  - Increase convenience through feedback to use the beta version.
- Week 3 : Infrastructure
  - Setup production environments.
- Week 4 : Test & Open


## Operation Milestone (1 Year)
- Month 1~3 : Develop and operate the beta service.
- Month 4~6 : Improve and apply major feedbacks according to operation.
- Month 7~9 : Improve service reliability
  - Develop 9c node status page (To speed up the detection of data sync abnormality)
  - Improve reliability through self-operating 9c node redundancy
  - Configure to service consistent performance even when processing billions or more of large volumes of data
- Month 10~12 : Open API
  - Provide data API service for external users who do not have direct access to a node
