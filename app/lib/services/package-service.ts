import { driveService } from "../google-drive";
import { Package } from "@/app/types/package";
import { v4 as uuidv4 } from "uuid";

export const packageService = {
    async getAllPackages(): Promise<Package[]> {
        try{
            const packages = await driveService.getCollection<Package>("packages");
            console.log("Packages from Drive:", packages);
            return packages;
        } catch (error) {
            console.error("Error fetching packages:", error);
            return [];
        }
    },

    async getPackageById(id: string): Promise<Package | null> {
        try {
            const packages = await this.getAllPackages();
            const pkg = packages.find(p => p.id === id);
            return pkg || null;
        } catch (error) {
            console.error("Error finding package:", error);
            return null;
        }
    },

    async createPackage(packageData: Omit<Package, "id" | "createdAt" | "updatedAt">): Promise<Package> {
        const packages = await this.getAllPackages();
        const newPackage: Package = {
            id: uuidv4(),
            ...packageData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        packages.push(newPackage);
        await driveService.saveCollection("packages", packages);
        return newPackage;
    }, 
    async updatePackage(id: string, updates: Partial<Package>): Promise<Package | null> {
        const packages = await this.getAllPackages();
        const pkgIndex = packages.findIndex(p => p.id === id);
        if (pkgIndex === -1) return null;

        packages[pkgIndex] = {
            ...packages[pkgIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        await driveService.saveCollection("packages", packages);
        return packages[pkgIndex];
    },
    async deletePackage(id: string): Promise<boolean> {
        const packages = await this.getAllPackages();
        const pkgIndex = packages.findIndex(p => p.id === id);
        if (pkgIndex === -1) return false;
        packages.splice(pkgIndex, 1);
        await driveService.saveCollection("packages", packages);
        return true;
    },
    async searchPackages(query: string): Promise<Package[]> {
        const packages = await this.getAllPackages();
        return packages.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
        );
    },
    async filterPackagesByPrice(minPrice: number, maxPrice: number): Promise<Package[]> {
        const packages = await this.getAllPackages();
        return packages.filter(p => p.price >= minPrice && p.price <= maxPrice);
    },
    async getPopularPackages(): Promise<Package[]> {
        const packages = await this.getAllPackages();
        return packages.filter(p => p.popular);
    },
    async sortPackagesByPrice(ascending: boolean = true): Promise<Package[]> {
        const packages = await this.getAllPackages();
        return packages.sort((a, b) => ascending ? a.price - b.price : b.price - a.price);
    },
    async sortPackagesByDuration(ascending: boolean = true): Promise<Package[]> {
        const packages = await this.getAllPackages();
        const durationToDays = (duration: string): number => {
            const match = duration.match(/(\d+)\s*(day|week|month|year)s?/i);
            if (!match) return 0;
            const value = parseInt(match[1], 10);
            const unit = match[2].toLowerCase();
            switch (unit) {
                case 'day': return value;
                case 'week': return value * 7;
                case 'month': return value * 30;
                case 'year': return value * 365;
                default: return 0;
            }
        };
        return packages.sort((a, b) => 
            ascending ? durationToDays(a.duration) - durationToDays(b.duration) 
                      : durationToDays(b.duration) - durationToDays(a.duration)
        );
    },
    async getPackagesByDeliverable(deliverable: string): Promise<Package[]> {
        const packages = await this.getAllPackages();
        return packages.filter(p => p.deliverables.includes(deliverable));
    },
    async getPackagesInPriceRange(minPrice: number, maxPrice: number): Promise<Package[]> {
        const packages = await this.getAllPackages();
        return packages.filter(p => p.price >= minPrice && p.price <= maxPrice);
    },
    async getRecentPackages(days: number): Promise<Package[]> {
        const packages = await this.getAllPackages();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return packages.filter(p => new Date(p.createdAt) >= cutoffDate);
    },
    async getUpdatedPackages(since: Date): Promise<Package[]> {
        const packages = await this.getAllPackages();
        return packages.filter(p => new Date(p.updatedAt) >= since);
    },
    async getPackageCount(): Promise<number> {
        const packages = await this.getAllPackages();
        return packages.length;
    },
    async getAveragePackagePrice(): Promise<number> {
        const packages = await this.getAllPackages();
        if (packages.length === 0) return 0;
        const total = packages.reduce((sum, p) => sum + p.price, 0);
        return total / packages.length;
    },
    async getTotalRevenue(): Promise<number> {
        const packages = await this.getAllPackages();
        return packages.reduce((sum, p) => sum + p.price, 0);
    },
    async getPackageNames(): Promise<string[]> {
        const packages = await this.getAllPackages();
        return packages.map(p => p.name);
    }
}