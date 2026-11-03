# Company seed data

`fortune500-2019.csv` contains the 2019 Fortune 500 company list from
[cmusam/fortune500](https://github.com/cmusam/fortune500). The seed command
uses the first 430 names from that file and supplements them with 70
India-focused companies to create a 500-company catalog.

The role catalog is generated from 100 role families and five career levels.
Run `npm run seed:options` from `Backend` to idempotently add both catalogs to
MongoDB. Existing company and role entries are retained.
