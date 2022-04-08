# # # # # # # # # # # # # # # # # # # # 
# Docker image with Cypress dependencies
#
# RUN steps: 
#
#   install cypress, copy config files, run
#
# # # # # # # # # # # # # # # # # # # # 
FROM cypress/included:8.3.0
COPY package.json .
RUN npm install && npm install -g wait-on

COPY cypress cypress
COPY cypress.json .
COPY start.cypress.sh .
# CMD ["npx","cypress","run","--headless","--browser", "chrome", "--record"]
CMD ["/bin/sh","start.cypress.sh"]