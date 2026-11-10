# Laboratory measurements

These notes define the columns of the wine-quality tables used in Exercise 1. Each measurement is a number from a chemical test. None of them is the quality score.

## Fixed acidity

Fixed acidity is the set of acids that do not evaporate easily, mostly tartaric acid. The tables record it in grams per litre.

## Volatile acidity

Volatile acidity is the set of acids that evaporate easily, mostly acetic acid. A high value often tastes like vinegar. The tables record it in grams per litre.

## Citric acid

Citric acid is one acid in the wine, recorded in grams per litre. It can add freshness. It is not a score of how good the wine is.

## Residual sugar

Residual sugar is the sugar left after fermentation, recorded in grams per litre. A dry wine has little residual sugar. A sweet wine has more. Residual sugar is a laboratory measurement. It is not the same thing as the quality score. Dropping this column, as one Exercise 1 option does, changes the inputs of the prediction model. It does not redefine quality.

## Chlorides

Chlorides estimate the salt in the wine, recorded in grams per litre.

## Sulfur dioxide

Free sulfur dioxide and total sulfur dioxide are preservative measurements, recorded in milligrams per litre. Free sulfur dioxide is the portion that is still available to protect the wine. Total sulfur dioxide includes the portion already bound to other compounds.

## Density

Density is the mass of the wine relative to water. Residual sugar and alcohol both move this number.

## pH

pH says how acidic the wine is on the usual pH scale. It is related to fixed acidity, and it is still its own column.

## Sulphates

Sulphates are a preservative measurement, recorded in grams per litre. They are not the same column as sulfur dioxide.

## Alcohol

Alcohol is the percent of alcohol by volume. Fermentation produces it from sugar. A wine can be high in alcohol and still receive a low quality score.
