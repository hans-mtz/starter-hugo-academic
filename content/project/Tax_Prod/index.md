---
# Documentation: https://wowchemy.com/docs/managing-content/
draft: false
title: "Tax evasion and Productivity (JMP)"
summary: |
  Value-added taxes (VAT) allow firms to deduct the taxes paid on purchases from the taxes collected on sales, creating an incentive for firms to overreport the purchases of inputs to reduce their tax bill. The fundamental issue in detecting input overreporting stems from two unobservables, true inputs and productivity. Because firms differ in productivity, a firm reporting high input use, for a given level of output, may be either overreporting or simply less productive. To distinguish between overreporting and productivity, I use a structural production-function approach and a benchmark group, a subset of firms that report inputs correctly. Because the benchmark firms are assumed to share the same technology as the other firms, I estimate the technology's parameters from them. Using these estimates, I compare what potentially tax-evading firms report with predictions of the true inputs they would use. I apply the method to a Colombian manufacturing survey from 1981 to 1991. During this period, the Colombian sales tax worked as a VAT and the data include a subset of firms that, due to government and market scrutiny, reported inputs correctly.
authors: [admin]
tags: ["Tax evasion" , "Productivity","Production Function"]
categories: []
date: "2026-10-06"

# Optional external URL for project (replaces project detail page).
external_link: ""

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Custom links (optional).
#   Uncomment and edit lines below to show custom links.
links:
- name: Follow
  url: https://twitter.com/Hans_Mtz
  icon_pack: fab
  icon: twitter

url_code: ""
url_pdf: ""
url_slides: ""
url_video: ""

share: false

# Slides (optional).
#   Associate this project with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides = "example-slides"` references `content/slides/example-slides.md`.
#   Otherwise, set `slides = ""`.
slides: ""
# css: xaringan-themer.css
---
## Abstract

Value-added taxes (VAT) allow firms to deduct the taxes paid on purchases from the taxes collected on sales, creating an incentive for firms to overreport the purchases of inputs to reduce their tax bill. The fundamental issue in detecting input overreporting stems from two unobservables, true inputs and productivity. Because firms differ in productivity, a firm reporting high input use, for a given level of output, may be either overreporting or simply less productive. To distinguish between overreporting and productivity, I use a structural production-function approach and a benchmark group, a subset of firms that report inputs correctly. Because the benchmark firms are assumed to share the same technology as the other firms, I estimate the technology's parameters from them. Using these estimates, I compare what potentially tax-evading firms report with predictions of the true inputs they would use. I apply the method to a Colombian manufacturing survey from 1981 to 1991. During this period, the Colombian sales tax worked as a VAT and the data include a subset of firms that, due to government and market scrutiny, reported inputs correctly.

My approach yields a simple and robust statistical test to detect input overreporting. Under the null hypothesis of correct reporting, the test is agnostic about the specification of both the probability of detection and the cost of overreporting. Among the 5 largest industries, the test rejects the null hypothesis in all 4 industries subject to the sales tax, and, as expected, it fails to reject in the industry exempt from the sales tax. In these 4 industries, firms overreport on average 14.7 percent of their true inputs in the median industry. Exploiting a 1983 fiscal reform in Colombia that raised the sales tax rate, I then document that firms overreport more after the increase. The response implies a midpoint elasticity of overreporting with respect to the tax rate of 5.9.

The magnitude of detected overreporting matters for methods of estimating production functions that exploit a flexible input to identify productivity {{< hugo-cite/hcite "Levinsohn2003;Doraszelski2013;Ackerberg2015;Gandhi2020" >}}. These methods typically assume that materials are flexible, and their demand or first-order conditions reveal productivity. However, materials are deductible under the VAT. Therefore, firms have the incentive to overreport the input these methods rely on. I show that failing to correct for overreporting yields larger output elasticities of materials, and more dispersed and less persistent productivity distributions. Using the production-function parameters, I estimate a structural model of input overreporting. With the model, I study how government revenue changes as expected deductions, true and fictitious, respond to the tax rate. At the baseline rate, a 1 percent increase in the sales tax rate on purchases raises expected deductions by about 1.2 percent, 0.2 points of which come from firms overreporting more. Undetected overreporting costs the government about 4 percent of the sales tax that firms in tax-evading industries owe on their sales.

<!--
## Introduction

Tax evasion is a significant concern for developing and developed countries[^wide]. Despite the vast efforts of the literature, measuring tax evasion remains a non-trivial task[^measure]. Direct empirical measures are mostly unreliable because firms and individuals have incentives to conceal their behavior {{</* hugo-cite/hcite "Slemrod2019" */>}}. Hence, it is unlikely that evasion would be truthfully reported in surveys, for instance. Indirect structural measures have had some degree of success in the case of individual income tax evasion {{</* hugo-cite/hcite "Pissarides1989" */>}}, but in the case of corporate tax evasion researchers must account for an additional unobserved variable, the productivity of firms. Having productivity estimates could potentially help, however, tax evasion has not been satisfactorily addressed in the estimation of productivity. I show that ignoring tax evasion leads to biased estimates of productivity. To address this gap in the literature, I provide a new estimation strategy to recover tax evasion and productivity using commonly available data. 

[^wide]: Tax evasion has been a long-standing concern for developing countries, but since the 2008 economic crisis, it has also been of increasing importance for developed countries {{</* hugo-cite/hcite "Slemrod2019" */>}}. 

[^measure]: The challenge is to obtain reliable data. Practitioners usually have to undergo time- and resource-consuming processes to access or collect data; for example, by requesting access to government administrative data or by collecting their own through surveys or experiments.

Indirect structural attempts to estimate corporate tax evasion have to account for the productivity of the firms. The reason is that low productivity might be naively quantified as tax evasion. Consider the case in which firms overreport input expenses to reduce their profits to evade taxes. A practitioner with output and input data might conclude that output is a function of inputs, thus it can be considered a second measure. She might try to recover true inputs and get an estimate of tax evasion by the difference between reported and true inputs. However, for a given level of output, high input utilization by a firm could be explained by either the amount of input the firm overreports to evade taxes or by its low productivity.

Firm-level estimates of productivity could be helpful to measure tax evasion, however, tax evasion has not been satisfactorily addressed in the estimation of productivity by the literature. The literature has coped with tax evasion by treating it as a classical measurement error. In other words, it has been assumed that tax-evasion misreporting has zero mean —some firms under-report and others over-report so that the misreporting does not bias the estimates of interest— and this misreporting is independent of everything else, including the attributes of the firms. However, the classical measurement error argument is inconsistent with economic intuition[^econ-int]. 

[^econ-int]: Economic intuition will inform us that systematic misreporting due to tax evasion should lead firms to decrease profits by either underreporting sales or overreporting costs. Put differently, there's no economic incentive for firms to go the other direction —overreporting sales or underreporting input expenses— and artificially increase their profits. An artificial increment of profits will increase the tax liabilities of the firm and decrease their after-tax real profits. Therefore, it is unlikely that tax evasion is mean zero. Economic intuition will also point out that the degree of misreporting is likely to vary across firms depending on the characteristics of the firms, e.g., age, size, owner's risk aversion, etc. 


I show that ignoring tax evasion leads to biased estimates of productivity. 
Productivity is measured as the residual of a production function, where the output is a function of the inputs. A key assumption is that input demand is strictly monotonic on the productivity {{</* hugo-cite/hcite "Gandhi2020;Ackerberg2015;Levinsohn2003" */>}}. That is, more productive firms will use fewer inputs and produce more output. To reduce their declared profits and evade taxes, firms might underreport sales or overreport expenses. Therefore, if firms underreport their output to reduce sales, or if firms overreport inputs to increase expenses, then the productivity estimates would be biased downward.

To address this gap in the literature, I provide a new estimation strategy to jointly recover tax evasion and productivity using commonly available data. In particular, the method can identify the density of tax evasion through input overreporting. The key insight is that the first-order conditions of the firms' cost minimization problem are informative about the optimal utilization of inputs and hence about tax evasion through input misreporting up to the current-period output shock. The identifying assumption is that there is a subset of firms that do not evade by overreporting inputs and the practitioner can identify them with some degree of confidence. From this subset of good firms, the production function parameters and the density of the random noise can be identified. We can then apply deconvolution techniques to learn about the distribution of tax evasion and productivity, and how they have changed over time. Furthermore, I can learn how evasion changes with productivity, and how this relationship has changed over time.

The obvious strands of the literature to which I contribute are tax evasion and productivity estimation. The contribution to the tax evasion literature is two-fold: (1) I provide an estimation strategy using commonly available data, and (2) the method identifies tax evasion through cost overreporting, an overlooked by the literature but relevant phenomenon. The contribution to the productivity literature is to show that ignoring tax evasion leads to biased estimates and to provide a method to recover the productivity density in the presence of input overreporting. -->

## References

{{< bibliography cited >}}
