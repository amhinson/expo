// Copyright © 2018 650 Industries. All rights reserved.

#import <Foundation/Foundation.h>
#import <ABI38_0_0UMCore/ABI38_0_0UMModuleRegistry.h>
#import <ABI38_0_0UMCore/ABI38_0_0UMSingletonModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface ABI38_0_0UMModuleRegistryProvider : NSObject

@property (nonatomic, weak) id<ABI38_0_0UMModuleRegistryDelegate> moduleRegistryDelegate;

+ (NSSet *)singletonModules;
+ (nullable ABI38_0_0UMSingletonModule *)getSingletonModuleForClass:(Class)singletonClass;

- (instancetype)initWithSingletonModules:(NSSet *)modules;
- (ABI38_0_0UMModuleRegistry *)moduleRegistry;

@end

NS_ASSUME_NONNULL_END
