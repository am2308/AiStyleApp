import axios from 'axios';
import marketplaceService from './marketplaceService.js';

// Enhanced AI service with better outfit generation
class LocalAIService {
  constructor() {
    console.log('Using enhanced local AI service for outfit recommendations');
  }

  async generateOutfitRecommendations(wardrobeItems, userProfile, occasion = null) {
    try {
      console.log('Generating outfit recommendations for', wardrobeItems.length, 'items, occasion:', occasion);

      // Analyze wardrobe comprehensively
      const analysis = this.analyzeWardrobe(wardrobeItems, userProfile);
      
      // Generate multiple outfit combinations using ALL items
      const outfits = this.generateComprehensiveOutfitCombinations(wardrobeItems, userProfile, occasion);
      
      // Generate missing items for each outfit
      const outfitsWithMissing = await Promise.all(
        outfits.map(async outfit => {
          const missingItems = await this.identifyMissingItemsWithProducts(outfit, wardrobeItems, userProfile);
          return {
            ...outfit,
            missingItems: missingItems
          };
        })
      );

      console.log('Generated recommendations:', outfitsWithMissing.length);

      return {
        recommendations: outfitsWithMissing,
        wardrobeAnalysis: analysis
      };
    } catch (error) {
      console.error('Error generating outfit recommendations:', error);
      return this.getMockRecommendations(wardrobeItems, userProfile, occasion);
    }
  }

  // Enhanced wardrobe analysis
  analyzeWardrobe(items, userProfile) {
    const categories = {};
    const colors = {};
    const occasions = {};
    
    items.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
      colors[item.color] = (colors[item.color] || 0) + 1;
      
      // Analyze item suitability for occasions
      const itemOccasions = this.getItemOccasions(item, userProfile);
      itemOccasions.forEach(occ => {
        occasions[occ] = (occasions[occ] || 0) + 1;
      });
    });

    const strengths = [];
    const gaps = [];
    const suggestions = [];

    // Analyze category distribution
    if (categories['Tops'] >= 3) strengths.push('Good variety of tops');
    if (categories['Bottoms'] >= 2) strengths.push('Sufficient bottom wear');
    if (categories['Footwear'] >= 2) strengths.push('Good footwear collection');
    if (categories['Dresses'] >= 1) strengths.push('Elegant dress options');
    if (Object.keys(colors).length >= 4) strengths.push('Great color variety');
    if (categories['Outerwear'] >= 1) strengths.push('Good layering options');

    // Identify gaps based on style and occasions
    if (!categories['Tops'] || categories['Tops'] < 3) {
      gaps.push('Need more versatile tops');
      suggestions.push('Add 2-3 more tops in different styles');
    }
    if (!categories['Bottoms'] || categories['Bottoms'] < 2) {
      gaps.push('Limited bottom wear options');
      suggestions.push('Add jeans, trousers, or skirts');
    }
    if (!categories['Outerwear']) {
      gaps.push('Missing outerwear for layering');
      suggestions.push('Add a blazer or jacket for versatility');
    }
    if (!categories['Accessories'] || categories['Accessories'] < 2) {
      gaps.push('Limited accessories');
      suggestions.push('Add accessories to enhance outfits');
    }
    if (!categories['Footwear'] || categories['Footwear'] < 2) {
      gaps.push('Need more footwear variety');
      suggestions.push('Add shoes for different occasions');
    }

    // Style-specific suggestions
    if (userProfile.preferredStyle === 'Business' && !categories['Outerwear']) {
      suggestions.push('Add professional blazers and formal shoes');
    }
    if (userProfile.preferredStyle === 'Casual' && categories['Tops'] < 3) {
      suggestions.push('Add more casual tops like t-shirts and sweaters');
    }

    return { strengths, gaps, suggestions };
  }

  // Generate comprehensive outfit combinations using ALL items
  generateComprehensiveOutfitCombinations(items, userProfile, occasion) {
    const outfits = [];
    
    // Categorize items
    const tops = items.filter(item => item.category === 'Tops');
    const bottoms = items.filter(item => item.category === 'Bottoms');
    const dresses = items.filter(item => item.category === 'Dresses');
    const outerwear = items.filter(item => item.category === 'Outerwear');
    const footwear = items.filter(item => item.category === 'Footwear');
    const accessories = items.filter(item => item.category === 'Accessories');

    console.log('Item distribution:', {
      tops: tops.length,
      bottoms: bottoms.length,
      dresses: dresses.length,
      outerwear: outerwear.length,
      footwear: footwear.length,
      accessories: accessories.length
    });

    // Generate dress-based outfits (use ALL dresses)
    dresses.forEach((dress, index) => {
      const outfit = {
        id: `dress_outfit_${index + 1}`,
        items: [dress.id],
        confidence: this.calculateConfidence([dress], userProfile, occasion, 'dress'),
        occasion: occasion || this.getBestOccasionForItem(dress, userProfile),
        description: this.generateOutfitDescription([dress], occasion, userProfile),
        styleNotes: this.generateStyleNotes([dress], userProfile)
      };
      
      // Add complementary items
      if (footwear.length > 0) {
        const bestShoes = this.findBestMatch(footwear, dress, occasion);
        if (bestShoes) outfit.items.push(bestShoes.id);
      }
      
      if (accessories.length > 0 && userProfile.preferredStyle !== 'Minimalist') {
        const bestAccessory = this.findBestMatch(accessories, dress, occasion);
        if (bestAccessory) outfit.items.push(bestAccessory.id);
      }
      
      if (outerwear.length > 0 && (occasion === 'Work' || occasion === 'Formal' || this.needsOuterwear(dress, occasion))) {
        const bestOuterwear = this.findBestMatch(outerwear, dress, occasion);
        if (bestOuterwear) outfit.items.push(bestOuterwear.id);
      }
      
      outfits.push(outfit);
    });

    // Generate top + bottom combinations (use ALL combinations)
    tops.forEach((top, topIndex) => {
      bottoms.forEach((bottom, bottomIndex) => {
        const outfit = {
          id: `combo_outfit_${topIndex}_${bottomIndex}`,
          items: [top.id, bottom.id],
          confidence: this.calculateConfidence([top, bottom], userProfile, occasion, 'combo'),
          occasion: occasion || this.getBestOccasionForItems([top, bottom], userProfile),
          description: this.generateOutfitDescription([top, bottom], occasion, userProfile),
          styleNotes: this.generateStyleNotes([top, bottom], userProfile)
        };

        // Add outerwear if appropriate
        if (outerwear.length > 0) {
          const needsLayer = occasion === 'Work' || occasion === 'Formal' || 
                           userProfile.preferredStyle === 'Business' ||
                           this.needsOuterwear(top, occasion);
          
          if (needsLayer) {
            const bestOuterwear = this.findBestMatch(outerwear, top, occasion);
            if (bestOuterwear) {
              outfit.items.push(bestOuterwear.id);
              outfit.confidence += 0.1;
            }
          }
        }

        // Add footwear
        if (footwear.length > 0) {
          const bestShoes = this.findBestMatch(footwear, top, occasion);
          if (bestShoes) outfit.items.push(bestShoes.id);
        }

        // Add accessories
        if (accessories.length > 0 && userProfile.preferredStyle !== 'Minimalist') {
          const bestAccessory = this.findBestMatch(accessories, top, occasion);
          if (bestAccessory) outfit.items.push(bestAccessory.id);
        }

        outfits.push(outfit);
      });
    });

    // Generate single-item showcases for special pieces
    const specialItems = [...outerwear, ...accessories].filter(item => 
      this.isStatementPiece(item, userProfile)
    );
    
    specialItems.forEach((item, index) => {
      if (outfits.length < 8) { // Limit total outfits
        const baseItems = this.findBaseItemsForStatement(item, tops, bottoms, dresses);
        if (baseItems.length > 0) {
          const outfit = {
            id: `statement_outfit_${index}`,
            items: [item.id, ...baseItems.map(i => i.id)],
            confidence: this.calculateConfidence([item, ...baseItems], userProfile, occasion, 'statement'),
            occasion: occasion || this.getBestOccasionForItem(item, userProfile),
            description: this.generateOutfitDescription([item, ...baseItems], occasion, userProfile),
            styleNotes: `This outfit highlights your ${item.name.toLowerCase()} as a statement piece.`
          };
          
          outfits.push(outfit);
        }
      }
    });

    // Sort by confidence and occasion relevance
    const sortedOutfits = outfits
      .sort((a, b) => {
        if (occasion && a.occasion === occasion && b.occasion !== occasion) return -1;
        if (occasion && b.occasion === occasion && a.occasion !== occasion) return 1;
        return b.confidence - a.confidence;
      })
      .slice(0, 6); // Return top 6 outfits

    return sortedOutfits.map(outfit => ({
      ...outfit,
      confidence: Math.min(outfit.confidence, 0.95)
    }));
  }

  // Enhanced confidence calculation based on occasion
  calculateConfidence(items, userProfile, occasion, type) {
    let confidence = 0.5; // Lower base confidence

    // Occasion-specific scoring
    if (occasion) {
      const occasionScore = this.getOccasionMatchScore(items, occasion, userProfile);
      confidence += occasionScore * 0.3;
    }

    // Style matching
    if (userProfile.preferredStyle) {
      const styleScore = this.getStyleMatchScore(items, userProfile.preferredStyle);
      confidence += styleScore * 0.2;
    }

    // Color coordination
    if (items.length > 1) {
      const colorScore = this.getColorCoordinationScore(items);
      confidence += colorScore * 0.15;
    }

    // Completeness bonus
    const completenessScore = this.getCompletenessScore(items);
    confidence += completenessScore * 0.15;

    // Body type compatibility
    if (userProfile.bodyType) {
      const bodyTypeScore = this.getBodyTypeScore(items, userProfile.bodyType);
      confidence += bodyTypeScore * 0.1;
    }

    // Seasonal appropriateness
    const seasonScore = this.getSeasonalScore(items);
    confidence += seasonScore * 0.1;

    return Math.max(0.3, Math.min(confidence, 0.95));
  }

  // Occasion-specific scoring
  getOccasionMatchScore(items, occasion, userProfile) {
    const occasionKeywords = {
      'Casual': ['casual', 't-shirt', 'jeans', 'sneakers', 'comfortable'],
      'Work': ['shirt', 'blouse', 'trousers', 'blazer', 'professional', 'formal'],
      'Formal': ['dress', 'suit', 'formal', 'elegant', 'blazer', 'heels'],
      'Date Night': ['dress', 'elegant', 'stylish', 'attractive'],
      'Party': ['dress', 'stylish', 'fun', 'colorful', 'trendy'],
      'Weekend': ['casual', 'comfortable', 'relaxed', 'jeans'],
      'Travel': ['comfortable', 'versatile', 'practical', 'layers']
    };

    const keywords = occasionKeywords[occasion] || [];
    let score = 0;
    
    items.forEach(item => {
      const itemText = `${item.name} ${item.category}`.toLowerCase();
      const matches = keywords.filter(keyword => itemText.includes(keyword)).length;
      score += matches / keywords.length;
    });

    return score / items.length;
  }

  // Style matching score
  getStyleMatchScore(items, preferredStyle) {
    const styleKeywords = {
      'Casual': ['casual', 't-shirt', 'jeans', 'sneakers', 'comfortable'],
      'Business': ['shirt', 'blazer', 'trousers', 'formal', 'professional'],
      'Formal': ['dress', 'suit', 'formal', 'elegant', 'classic'],
      'Bohemian': ['flowy', 'boho', 'loose', 'artistic', 'free'],
      'Minimalist': ['simple', 'clean', 'basic', 'minimal', 'sleek'],
      'Trendy': ['fashion', 'trendy', 'modern', 'stylish', 'contemporary'],
      'Classic': ['classic', 'timeless', 'traditional', 'elegant']
    };

    const keywords = styleKeywords[preferredStyle] || [];
    let score = 0;
    
    items.forEach(item => {
      const itemText = `${item.name} ${item.category}`.toLowerCase();
      const matches = keywords.filter(keyword => itemText.includes(keyword)).length;
      score += matches / keywords.length;
    });

    return score / items.length;
  }

  // Color coordination scoring
  getColorCoordinationScore(items) {
    const colors = items.map(item => item.color.toLowerCase());
    
    // Neutral colors that go with everything
    const neutrals = ['black', 'white', 'gray', 'grey', 'brown', 'beige', 'navy'];
    const hasNeutral = colors.some(color => neutrals.includes(color));
    
    if (hasNeutral) return 0.8; // High score for neutral combinations
    
    // Monochromatic (same color family)
    if (colors.every(color => color === colors[0])) return 0.9;
    
    // Complementary color combinations
    const complementaryPairs = [
      ['blue', 'orange'], ['red', 'green'], ['yellow', 'purple'],
      ['blue', 'white'], ['red', 'white'], ['black', 'white']
    ];
    
    for (const pair of complementaryPairs) {
      if (colors.includes(pair[0]) && colors.includes(pair[1])) {
        return 0.7;
      }
    }
    
    return 0.4; // Lower score for potentially clashing colors
  }

  // Outfit completeness scoring
  getCompletenessScore(items) {
    const categories = items.map(item => item.category);
    const uniqueCategories = new Set(categories);
    
    let score = 0;
    
    // Base outfit (top + bottom OR dress)
    if (categories.includes('Dresses') || 
        (categories.includes('Tops') && categories.includes('Bottoms'))) {
      score += 0.5;
    }
    
    // Footwear
    if (categories.includes('Footwear')) score += 0.2;
    
    // Outerwear for layering
    if (categories.includes('Outerwear')) score += 0.2;
    
    // Accessories for finishing touches
    if (categories.includes('Accessories')) score += 0.1;
    
    return score;
  }

  // Body type compatibility (simplified)
  getBodyTypeScore(items, bodyType) {
    // This is a simplified version - in a real app, you'd have detailed rules
    const bodyTypePreferences = {
      'Pear': ['a-line', 'flowy', 'loose top', 'fitted bottom'],
      'Apple': ['empire waist', 'v-neck', 'loose', 'flowy'],
      'Hourglass': ['fitted', 'belted', 'wrap', 'tailored'],
      'Rectangle': ['layered', 'textured', 'ruffles', 'patterns'],
      'Inverted Triangle': ['wide leg', 'a-line', 'loose bottom', 'fitted top']
    };
    
    const preferences = bodyTypePreferences[bodyType] || [];
    let score = 0;
    
    items.forEach(item => {
      const itemText = item.name.toLowerCase();
      const matches = preferences.filter(pref => itemText.includes(pref)).length;
      score += matches / preferences.length;
    });
    
    return score / items.length;
  }

  // Seasonal appropriateness
  getSeasonalScore(items) {
    const currentMonth = new Date().getMonth();
    const season = this.getCurrentSeason(currentMonth);
    
    const seasonalItems = {
      'spring': ['light', 'cotton', 'pastel', 'jacket'],
      'summer': ['light', 'cotton', 'shorts', 'sandals', 'bright'],
      'fall': ['warm', 'layers', 'jacket', 'boots', 'sweater'],
      'winter': ['warm', 'coat', 'boots', 'sweater', 'layers']
    };
    
    const seasonalKeywords = seasonalItems[season] || [];
    let score = 0;
    
    items.forEach(item => {
      const itemText = `${item.name} ${item.category}`.toLowerCase();
      const matches = seasonalKeywords.filter(keyword => itemText.includes(keyword)).length;
      score += matches / seasonalKeywords.length;
    });
    
    return score / items.length;
  }

  // Helper methods
  getCurrentSeason(month) {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  getItemOccasions(item, userProfile) {
    const itemText = `${item.name} ${item.category}`.toLowerCase();
    const occasions = [];
    
    if (itemText.includes('casual') || itemText.includes('t-shirt') || itemText.includes('jeans')) {
      occasions.push('Casual', 'Weekend');
    }
    if (itemText.includes('formal') || itemText.includes('dress') || itemText.includes('suit')) {
      occasions.push('Formal', 'Date Night');
    }
    if (itemText.includes('work') || itemText.includes('business') || itemText.includes('blazer')) {
      occasions.push('Work');
    }
    if (itemText.includes('party') || itemText.includes('stylish')) {
      occasions.push('Party');
    }
    
    return occasions.length > 0 ? occasions : ['Casual'];
  }

  getBestOccasionForItem(item, userProfile) {
    const occasions = this.getItemOccasions(item, userProfile);
    return occasions[0] || 'Casual';
  }

  getBestOccasionForItems(items, userProfile) {
    const allOccasions = items.flatMap(item => this.getItemOccasions(item, userProfile));
    const occasionCounts = {};
    
    allOccasions.forEach(occ => {
      occasionCounts[occ] = (occasionCounts[occ] || 0) + 1;
    });
    
    return Object.keys(occasionCounts).reduce((a, b) => 
      occasionCounts[a] > occasionCounts[b] ? a : b
    ) || 'Casual';
  }

  findBestMatch(items, baseItem, occasion) {
    if (items.length === 0) return null;
    
    // Score each item based on color coordination and occasion appropriateness
    const scoredItems = items.map(item => ({
      item,
      score: this.getMatchScore(item, baseItem, occasion)
    }));
    
    scoredItems.sort((a, b) => b.score - a.score);
    return scoredItems[0].item;
  }

  getMatchScore(item, baseItem, occasion) {
    let score = 0;
    
    // Color coordination
    if (this.colorsMatch([item.color, baseItem.color])) {
      score += 0.5;
    }
    
    // Occasion appropriateness
    const itemOccasions = this.getItemOccasions(item, {});
    if (occasion && itemOccasions.includes(occasion)) {
      score += 0.3;
    }
    
    // Category appropriateness
    if (this.categoriesMatch(item.category, baseItem.category, occasion)) {
      score += 0.2;
    }
    
    return score;
  }

  colorsMatch(colors) {
    const neutrals = ['black', 'white', 'gray', 'grey', 'brown', 'beige'];
    const hasNeutral = colors.some(color => neutrals.includes(color.toLowerCase()));
    
    if (hasNeutral) return true;
    if (colors[0].toLowerCase() === colors[1].toLowerCase()) return true;
    
    // Basic complementary colors
    const complementary = {
      'blue': ['white', 'gray', 'black', 'brown'],
      'red': ['white', 'black', 'gray'],
      'green': ['white', 'black', 'brown'],
      'yellow': ['black', 'white', 'blue']
    };
    
    const color1 = colors[0].toLowerCase();
    const color2 = colors[1].toLowerCase();
    
    return complementary[color1]?.includes(color2) || complementary[color2]?.includes(color1);
  }

  categoriesMatch(category1, category2, occasion) {
    // Define which categories work well together
    const goodCombinations = {
      'Tops': ['Bottoms', 'Outerwear', 'Accessories', 'Footwear'],
      'Bottoms': ['Tops', 'Outerwear', 'Accessories', 'Footwear'],
      'Dresses': ['Outerwear', 'Accessories', 'Footwear'],
      'Outerwear': ['Tops', 'Bottoms', 'Dresses', 'Footwear'],
      'Footwear': ['Tops', 'Bottoms', 'Dresses', 'Outerwear'],
      'Accessories': ['Tops', 'Bottoms', 'Dresses', 'Outerwear']
    };
    
    return goodCombinations[category1]?.includes(category2) || false;
  }

  needsOuterwear(item, occasion) {
    const itemText = item.name.toLowerCase();
    return occasion === 'Work' || 
           occasion === 'Formal' || 
           itemText.includes('sleeveless') || 
           itemText.includes('tank');
  }

  isStatementPiece(item, userProfile) {
    const itemText = item.name.toLowerCase();
    return itemText.includes('statement') || 
           itemText.includes('bold') || 
           itemText.includes('unique') ||
           item.category === 'Accessories';
  }

  findBaseItemsForStatement(statementItem, tops, bottoms, dresses) {
    // For statement pieces, find neutral base items
    const neutralColors = ['black', 'white', 'gray', 'grey', 'brown', 'beige'];
    
    if (statementItem.category === 'Accessories') {
      // Find neutral tops and bottoms
      const neutralTops = tops.filter(item => 
        neutralColors.includes(item.color.toLowerCase())
      );
      const neutralBottoms = bottoms.filter(item => 
        neutralColors.includes(item.color.toLowerCase())
      );
      
      if (neutralTops.length > 0 && neutralBottoms.length > 0) {
        return [neutralTops[0], neutralBottoms[0]];
      }
      if (neutralTops.length > 0) return [neutralTops[0]];
      if (neutralBottoms.length > 0) return [neutralBottoms[0]];
    }
    
    return [];
  }

  generateOutfitDescription(items, occasion, userProfile) {
    const categories = items.map(item => item.category);
    const colors = items.map(item => item.color);
    const primaryColor = colors[0];
    
    if (categories.includes('Dresses')) {
      const dress = items.find(item => item.category === 'Dresses');
      return `Elegant ${dress.color.toLowerCase()} dress perfect for ${occasion || 'any occasion'}. ${this.getStyleDescription(userProfile.preferredStyle)}`;
    } else {
      const top = items.find(item => item.category === 'Tops');
      const bottom = items.find(item => item.category === 'Bottoms');
      
      if (top && bottom) {
        return `Stylish combination of ${top.color.toLowerCase()} ${top.name.toLowerCase()} with ${bottom.color.toLowerCase()} ${bottom.name.toLowerCase()}. Perfect for ${occasion || 'everyday wear'}.`;
      }
    }
    
    return `A well-coordinated outfit featuring ${primaryColor.toLowerCase()} tones, ideal for ${occasion || 'various occasions'}.`;
  }

  generateStyleNotes(items, userProfile) {
    const notes = [];
    
    if (userProfile.skinTone) {
      notes.push(`The color palette complements your ${userProfile.skinTone} skin tone beautifully.`);
    }
    
    if (userProfile.bodyType) {
      notes.push(`This combination flatters your ${userProfile.bodyType} body type.`);
    }
    
    if (userProfile.preferredStyle) {
      notes.push(`Perfectly aligned with your ${userProfile.preferredStyle} style preference.`);
    }
    
    // Add color coordination note
    const colors = items.map(item => item.color);
    if (colors.length > 1 && this.colorsMatch(colors)) {
      notes.push(`The color coordination creates a harmonious and polished look.`);
    }
    
    return notes.join(' ') || 'A well-balanced outfit that showcases your personal style.';
  }

  getStyleDescription(style) {
    const descriptions = {
      'Casual': 'Comfortable and relaxed for everyday activities.',
      'Business': 'Professional and polished for the workplace.',
      'Formal': 'Sophisticated and elegant for special occasions.',
      'Bohemian': 'Free-spirited and artistic with flowing elements.',
      'Minimalist': 'Clean and simple with understated elegance.',
      'Trendy': 'Fashion-forward and contemporary.',
      'Classic': 'Timeless and traditional with enduring appeal.'
    };
    
    return descriptions[style] || 'Stylish and versatile for various occasions.';
  }

  // Enhanced missing items identification with marketplace integration
  async identifyMissingItemsWithProducts(outfit, wardrobeItems, userProfile) {
    const missingItems = [];
    const outfitItems = wardrobeItems.filter(item => outfit.items.includes(item.id));
    const categories = outfitItems.map(item => item.category);

    // Check for missing essential categories
    if (!categories.includes('Footwear')) {
      const footwearItem = {
        category: 'Footwear',
        color: this.suggestComplementaryColor(outfitItems),
        description: `${outfit.occasion} shoes to complete the outfit`,
        searchTerms: this.generateSearchTerms('Footwear', outfit.occasion, userProfile),
        priority: 'high',
        priceRange: { min: 30, max: 120 }
      };
      
      // Get marketplace products for this missing item
      try {
        const products = await marketplaceService.searchProducts(
          footwearItem.searchTerms,
          'Footwear',
          footwearItem.priceRange,
          ['ebay', 'free']
        );
        footwearItem.availableProducts = products.slice(0, 3);
      } catch (error) {
        console.log('Could not fetch marketplace products for footwear');
        footwearItem.availableProducts = [];
      }
      
      missingItems.push(footwearItem);
    }

    if (!categories.includes('Accessories') && userProfile.preferredStyle !== 'Minimalist') {
      const accessoryItem = {
        category: 'Accessories',
        color: 'Multi',
        description: `Accessories to enhance your ${outfit.occasion.toLowerCase()} look`,
        searchTerms: this.generateSearchTerms('Accessories', outfit.occasion, userProfile),
        priority: 'medium',
        priceRange: { min: 15, max: 60 }
      };
      
      try {
        const products = await marketplaceService.searchProducts(
          accessoryItem.searchTerms,
          'Accessories',
          accessoryItem.priceRange,
          ['ebay', 'free']
        );
        accessoryItem.availableProducts = products.slice(0, 3);
      } catch (error) {
        console.log('Could not fetch marketplace products for accessories');
        accessoryItem.availableProducts = [];
      }
      
      missingItems.push(accessoryItem);
    }

    if ((outfit.occasion === 'Work' || outfit.occasion === 'Formal') && !categories.includes('Outerwear')) {
      const outerwearItem = {
        category: 'Outerwear',
        color: 'Black',
        description: `Professional ${outfit.occasion.toLowerCase()} jacket or blazer`,
        searchTerms: this.generateSearchTerms('Outerwear', outfit.occasion, userProfile),
        priority: 'high',
        priceRange: { min: 50, max: 200 }
      };
      
      try {
        const products = await marketplaceService.searchProducts(
          outerwearItem.searchTerms,
          'Outerwear',
          outerwearItem.priceRange,
          ['ebay', 'free']
        );
        outerwearItem.availableProducts = products.slice(0, 3);
      } catch (error) {
        console.log('Could not fetch marketplace products for outerwear');
        outerwearItem.availableProducts = [];
      }
      
      missingItems.push(outerwearItem);
    }

    return missingItems;
  }

  suggestComplementaryColor(items) {
    const colors = items.map(item => item.color.toLowerCase());
    const hasNeutral = colors.some(color => ['black', 'white', 'gray', 'brown'].includes(color));
    
    if (hasNeutral) return 'Black';
    if (colors.includes('blue')) return 'Brown';
    if (colors.includes('red')) return 'Black';
    
    return 'Black'; // Default safe choice
  }

  generateSearchTerms(category, occasion, userProfile) {
    const baseTerms = [category.toLowerCase()];
    
    if (occasion) {
      baseTerms.push(occasion.toLowerCase());
    }
    
    if (userProfile.preferredStyle) {
      baseTerms.push(userProfile.preferredStyle.toLowerCase());
    }
    
    // Add category-specific terms
    const categoryTerms = {
      'Footwear': ['shoes', 'boots', 'sneakers'],
      'Accessories': ['jewelry', 'watch', 'belt', 'bag'],
      'Outerwear': ['jacket', 'blazer', 'coat'],
      'Tops': ['shirt', 'blouse', 'top'],
      'Bottoms': ['pants', 'jeans', 'trousers']
    };
    
    if (categoryTerms[category]) {
      baseTerms.push(...categoryTerms[category]);
    }
    
    return baseTerms.filter(term => term && term.length > 0);
  }

  getMockRecommendations(wardrobeItems, userProfile, occasion) {
    return {
      recommendations: [
        {
          id: 'mock_outfit_1',
          items: wardrobeItems.slice(0, Math.min(2, wardrobeItems.length)).map(item => item.id),
          confidence: 0.75,
          occasion: occasion || 'Casual',
          description: 'A versatile outfit that works well with your style preferences.',
          styleNotes: 'This combination creates a balanced look that complements your features.',
          missingItems: []
        }
      ],
      wardrobeAnalysis: {
        strengths: ['Good foundation pieces'],
        gaps: ['Could use more accessories'],
        suggestions: ['Consider adding versatile pieces that can be mixed and matched']
      }
    };
  }
}

const aiService = new LocalAIService();

export const generateOutfitRecommendations = async (wardrobeItems, userProfile, occasion = null) => {
  return await aiService.generateOutfitRecommendations(wardrobeItems, userProfile, occasion);
};

export const generateMarketplaceRecommendations = async (userProfile, filters = {}) => {
  try {
    const { category, color, occasion, priceRange } = filters;
    
    // Generate search terms based on user profile and filters
    const searchTerms = generateSearchTerms(userProfile, { category, color, occasion });
    
    // Search marketplace
    const products = await marketplaceService.searchProducts(
      searchTerms,
      category,
      priceRange,
      ['ebay', 'free']
    );

    // Filter and rank products based on user preferences
    const rankedProducts = rankProductsForUser(products, userProfile);

    return rankedProducts.slice(0, 20);
  } catch (error) {
    console.error('Error generating marketplace recommendations:', error);
    return getFallbackMarketplaceItems();
  }
};

export const generateSmartShoppingList = async (wardrobeItems, userProfile, targetOccasions = []) => {
  try {
    // Analyze wardrobe gaps
    const analysis = aiService.analyzeWardrobe(wardrobeItems, userProfile);
    
    // Generate shopping recommendations based on gaps
    const shoppingList = await generateShoppingRecommendationsWithProducts(analysis, userProfile, targetOccasions);
    
    return { shoppingList };
  } catch (error) {
    console.error('Error generating smart shopping list:', error);
    return { shoppingList: [] };
  }
};

// Enhanced shopping recommendations with marketplace integration
async function generateShoppingRecommendationsWithProducts(analysis, userProfile, targetOccasions) {
  const recommendations = [];

  // Process each gap and get marketplace products
  for (const gap of analysis.gaps) {
    if (gap.includes('tops') && recommendations.length < 5) {
      const item = {
        item: `${userProfile.preferredStyle || 'Versatile'} Top`,
        category: 'Tops',
        priority: 'high',
        reason: 'Essential for creating multiple outfit combinations',
        searchTerms: ['shirt', 'top', 'blouse', userProfile.preferredStyle?.toLowerCase()].filter(Boolean),
        priceRange: { min: 20, max: 80 },
        occasions: targetOccasions.length > 0 ? targetOccasions : ['Casual', 'Work']
      };
      
      try {
        const products = await marketplaceService.searchProducts(
          item.searchTerms,
          'Tops',
          item.priceRange,
          ['ebay', 'free']
        );
        item.availableProducts = products.slice(0, 5);
      } catch (error) {
        item.availableProducts = [];
      }
      
      recommendations.push(item);
    }

    if (gap.includes('bottoms') && recommendations.length < 5) {
      const item = {
        item: `${userProfile.preferredStyle || 'Versatile'} Bottoms`,
        category: 'Bottoms',
        priority: 'high',
        reason: 'Essential for creating complete outfits',
        searchTerms: ['pants', 'jeans', 'trousers', userProfile.preferredStyle?.toLowerCase()].filter(Boolean),
        priceRange: { min: 25, max: 100 },
        occasions: targetOccasions.length > 0 ? targetOccasions : ['Casual', 'Work']
      };
      
      try {
        const products = await marketplaceService.searchProducts(
          item.searchTerms,
          'Bottoms',
          item.priceRange,
          ['ebay', 'free']
        );
        item.availableProducts = products.slice(0, 5);
      } catch (error) {
        item.availableProducts = [];
      }
      
      recommendations.push(item);
    }

    if (gap.includes('outerwear') && recommendations.length < 5) {
      const item = {
        item: 'Professional Blazer',
        category: 'Outerwear',
        priority: 'medium',
        reason: 'Adds professionalism and versatility to outfits',
        searchTerms: ['blazer', 'jacket', 'professional', 'work'],
        priceRange: { min: 40, max: 150 },
        occasions: ['Work', 'Formal']
      };
      
      try {
        const products = await marketplaceService.searchProducts(
          item.searchTerms,
          'Outerwear',
          item.priceRange,
          ['ebay', 'free']
        );
        item.availableProducts = products.slice(0, 5);
      } catch (error) {
        item.availableProducts = [];
      }
      
      recommendations.push(item);
    }

    if (gap.includes('footwear') && recommendations.length < 5) {
      const item = {
        item: 'Versatile Shoes',
        category: 'Footwear',
        priority: 'high',
        reason: 'Complete your outfits with appropriate footwear',
        searchTerms: ['shoes', 'footwear', userProfile.preferredStyle?.toLowerCase()].filter(Boolean),
        priceRange: { min: 30, max: 120 },
        occasions: targetOccasions.length > 0 ? targetOccasions : ['Casual', 'Work']
      };
      
      try {
        const products = await marketplaceService.searchProducts(
          item.searchTerms,
          'Footwear',
          item.priceRange,
          ['ebay', 'free']
        );
        item.availableProducts = products.slice(0, 5);
      } catch (error) {
        item.availableProducts = [];
      }
      
      recommendations.push(item);
    }

    if (gap.includes('accessories') && recommendations.length < 5) {
      const item = {
        item: 'Statement Accessories',
        category: 'Accessories',
        priority: 'medium',
        reason: 'Enhance your outfits with finishing touches',
        searchTerms: ['accessories', 'jewelry', 'watch', 'belt'],
        priceRange: { min: 15, max: 60 },
        occasions: targetOccasions.length > 0 ? targetOccasions : ['Casual', 'Work', 'Date Night']
      };
      
      try {
        const products = await marketplaceService.searchProducts(
          item.searchTerms,
          'Accessories',
          item.priceRange,
          ['ebay', 'free']
        );
        item.availableProducts = products.slice(0, 5);
      } catch (error) {
        item.availableProducts = [];
      }
      
      recommendations.push(item);
    }
  }

  return recommendations;
}

// Helper functions
function generateSearchTerms(userProfile, filters) {
  const terms = [];
  
  if (filters.category) terms.push(filters.category.toLowerCase());
  if (filters.color) terms.push(filters.color.toLowerCase());
  if (filters.occasion) terms.push(filters.occasion.toLowerCase());
  
  // Add style-specific terms
  if (userProfile.preferredStyle) {
    const styleTerms = {
      'Casual': ['casual', 'comfortable'],
      'Business': ['professional', 'business'],
      'Formal': ['formal', 'elegant'],
      'Bohemian': ['boho', 'bohemian'],
      'Minimalist': ['minimalist', 'simple'],
      'Trendy': ['trendy', 'fashion'],
      'Classic': ['classic', 'timeless']
    };
    
    const styleSpecificTerms = styleTerms[userProfile.preferredStyle] || [];
    terms.push(...styleSpecificTerms);
  }
  
  return terms.length > 0 ? terms : ['fashion', 'clothing'];
}

function rankProductsForUser(products, userProfile) {
  return products.map(product => {
    let score = 0;
    
    // Price scoring
    if (product.price >= 20 && product.price <= 100) score += 2;
    else if (product.price < 20) score += 1;
    
    // Rating scoring
    if (product.rating) score += product.rating;
    
    // Source preference
    if (product.source === 'eBay') score += 1;
    
    // Style matching
    if (userProfile.preferredStyle && 
        product.name.toLowerCase().includes(userProfile.preferredStyle.toLowerCase())) {
      score += 2;
    }
    
    return { ...product, relevanceScore: score };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function getFallbackMarketplaceItems() {
  return [
    {
      id: 'fallback_1',
      name: 'Classic White Button-Down Shirt',
      price: 49.99,
      imageUrl: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600',
      url: 'https://www.ebay.com/sch/i.html?_nkw=white+button+shirt',
      source: 'eBay',
      brand: 'StyleCo',
      category: 'Tops',
      rating: 4.2
    }
  ];
}
