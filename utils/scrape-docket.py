#!/usr/bin/env python

#TODO: make cases actual objects

import slate, re, json

DOCKET = 'DOCKET'
JUDGE = 'Judge Assigned'
JUDGES_PRES = 'Presiding Judge(s)'
COP = 'Arresting Officer'
ADA = 'ADA(s)'
DEF_ATTY = 'Defence Attorney(s)'
ARREST_DATE = 'Arrest Date'
DEF_CITY = 'Defendant City'
DEF_STATE = 'Defendant State'
DEF_ZIP = 'Defendant Zipcode'
INC_LOC = 'Incarceration Location(s)'
CHARGES = 'Charges'
    
docketRE	    = re.compile("Docket Number: ([A-Z0-9\-]+)")
judgeAssignedRE	    = re.compile("Judge Assigned: ([A-Za-z, ]+)")
judgePresidingRE    = re.compile("The Honorable ([A-Za-z,. ]+?) presiding.")
copRE		    = re.compile("Arresting Officer: ([A-Za-z., ]+)")
adaRE		    = re.compile("ADA: ([A-Za-z,. ]+)/? [A-Za-z]+?:")
defattyRE   	    = re.compile("DAtty: ([A-Za-z,. ]+) +?[A-Za-z]+?:")
arrestdateRE	    = re.compile("Arrest Date: (\d+/\d+/\d+)")
defAddrRE	    = re.compile("City/State/Zip: ([A-Za-z]+), +([A-Z][A-Z]) +(\d{5})")
chargesRE	    = re.compile("([\d-]+ ?\xc2\xa7 ?[\d-]+) ?(\xc2\xa7\xc2\xa7[A-Z]\d+)?")
incLocRE	    = re.compile("currently incarcerated at (A-Za-z )+")
cases = {}
ADAs = {}
judges = {}

for report in ['CPReport1.pdf', 'CPReport2.pdf', 'CPReport3.pdf', 'CPReport4.pdf', 'CPReport5.pdf', 'CPReport6.pdf']:
    with open(report) as f:
	doc = slate.PDF(f)

    try:
	d = docketRE.search(doc.text()).group(1)
    except:
	continue

    ja	    = judgeAssignedRE.search(doc.text())
    jp	    = judgePresidingRE.findall(doc.text())
    c	    = copRE.search(repr(doc)) #picks up extra stuff with .text() since it strips \n
    a	    = adaRE.findall(doc.text())
    defa    = defattyRE.findall(doc.text())
    adate   = arrestdateRE.search(doc.text())
    addr    = defAddrRE.search(doc.text())
    charges = chargesRE.findall(doc.text())

    #print charges

    cases[d] = {DOCKET : d} 
    if ja:	cases[d][JUDGE]		= ja.group(1)
    if jp:	cases[d][JUDGES_PRES]   = list(set(jp))
    if c:	cases[d][COP]		= c.group(1)
    if a:	cases[d][ADA]		= list(set(a)) #list(set(x)) gets rid of duplicates while staying serializable
    if defa:	cases[d][DEF_ATTY]      = list(set(defa))
    if adate:	cases[d][ARREST_DATE]   = adate.group(1)
    if charges:	cases[d][CHARGES]	= list(set(charges))
    if addr:   
	cases[d][DEF_CITY]	= addr.group(1)
	cases[d][DEF_STATE]	= addr.group(2)
	cases[d][DEF_ZIP]	= addr.group(3)


    allj = set()
    if ja:
	allj.add(cases[d][JUDGE])
    if jp:
	allj.update(cases[d][JUDGES_PRES])

    for j in allj:
	if j in judges:
	    judges[j].append(d)
	else:
	    judges[j] = [d]
    
    if ADA in cases[d]:
	for ada in cases[d][ADA]:
	    if ada in ADAs:
		ADAs[ada].append(d)
	    else:
		ADAs[ada] = [d]

output = { "Cases" : cases, 
    "Cases By ADA" : ADAs, 
    "Cases By Judge" : judges 
    }

print json.dumps(output, sort_keys=True, indent=4)
#print doc.text()

#for l in doc:
#    print l


